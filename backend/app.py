import os
import logging
import requests
from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from pgvector.sqlalchemy import Vector
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import google.generativeai as genai

# --- Basic Setup & Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__, template_folder='templates')
CORS(app)

# --- Environment Variables ---
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a-secure-default-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
WORKER_URL = os.environ.get("WORKER_URL") # e.g., https://your-worker-service.a.run.app
WORKER_AUTH_TOKEN = os.environ.get("WORKER_AUTH_TOKEN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# --- Database & Auth ---
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# --- AI Model ---
try:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    embedding_model = 'models/embedding-001'
    logging.info("Gemini models configured successfully.")
except Exception as e:
    gemini_model = None
    embedding_model = None
    logging.error(f"Failed to configure Gemini models: {e}")

# --- SQLAlchemy Table Models ---
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    client_id = db.Column(db.String(128), nullable=True)

class Document(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    embedding = db.Column(Vector(768))
    client_id = db.Column(db.Text, nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- AUTHENTICATION ROUTES ---
@app.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    password = request.form.get('password')
    if User.query.filter_by(email=email).first():
        return redirect("https://www.getmindwise.com/register.html?error=true")
    
    password_hash = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()
    
    login_user(new_user)
    return redirect(url_for('dashboard'))

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return redirect(url_for('dashboard'))
    return redirect("https://www.getmindwise.com/login.html?error=true")

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("https://www.getmindwise.com/login.html")

# --- DASHBOARD & JOB DISPATCHING ---
@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user_email=current_user.email, client_id=current_user.client_id)

@app.route('/dashboard/create-script', methods=['POST'])
@login_required
def create_script():
    website_url = request.json.get('website_url')
    if not website_url:
        return jsonify({'error': 'Website URL is required.'}), 400
    if not website_url.startswith('http'):
        website_url = 'https://' + website_url

    # Call the external worker to start the job
    try:
        headers = {'Authorization': f'Bearer {WORKER_AUTH_TOKEN}'}
        payload = {'user_id': current_user.id, 'website_url': website_url}
        response = requests.post(f"{WORKER_URL}/process", json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        
        return jsonify({
            'status': 'processing',
            'message': 'Your website is being processed! This can take a few minutes. Your Client ID will appear on the dashboard when ready.'
        }), 202 # 202 Accepted
    except requests.RequestException as e:
        logging.error(f"Failed to dispatch job to worker: {e}")
        return jsonify({'error': 'Failed to start the scraping process. Please try again later.'}), 500

# --- PUBLIC CHATBOT API ---
@app.route('/ask', methods=['POST'])
def ask_bot():
    data = request.json
    question = data.get('question')
    client_id = data.get('clientId')
    if not all([question, client_id, embedding_model]):
        return jsonify({'error': 'Missing data or embedding model not configured'}), 400

    try:
        # 1. Embed the user's question
        question_embedding = genai.embed_content(
            model=embedding_model,
            content=question,
            task_type="RETRIEVAL_QUERY"
        )['embedding']

        # 2. Find relevant documents in the database
        # The `<->` operator performs a cosine distance search
        relevant_docs = db.session.query(Document.content).filter(
            Document.client_id == client_id
        ).order_by(
            Document.embedding.l2_distance(question_embedding)
        ).limit(5).all()

        if not relevant_docs:
            return jsonify({"status": "human_handoff", "answer": "I couldn't find an answer in my knowledge base. Would you like to create a support ticket?"})

        # 3. Build the context for the final answer
        context = "\n\n---\n\n".join([doc.content for doc in relevant_docs])
        prompt = f"""You are a helpful AI assistant. Answer the user's question based only on the context provided. Answer in a natural, conversational paragraph of 2-3 sentences. If the answer is not in the context, your entire response must be the single keyword: 'knowledge_gap'.

        --- CONTEXT ---
        {context}
        --- END CONTEXT ---

        User Question: {question}
        Answer:"""

        # 4. Generate the final answer
        if not gemini_model:
            raise ValueError("Generative model not configured.")
        
        answer = gemini_model.generate_content(prompt).text
        
        if "knowledge_gap" in answer:
             return jsonify({"status": "human_handoff", "answer": "I couldn't find a specific answer. Would you like to create a support ticket?"})
        else:
            return jsonify({"status": "success", "answer": answer})

    except Exception as e:
        logging.error(f"Error in /ask for client {client_id}: {e}", exc_info=True)
        return jsonify({"status": "human_handoff", "answer": "I'm having trouble accessing my knowledge. I can create a support ticket."}), 500

# --- STARTUP ---


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8081)))