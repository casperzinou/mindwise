import os
import logging
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from pgvector.sqlalchemy import Vector
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import google.generativeai as genai
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# --- Basic Setup & Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)

# --- Environment Variables & Secrets ---
# IMPORTANT: These MUST be set as environment variables in your hosting provider (Fly.io)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-mode-only-insecure-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
WORKER_URL = os.environ.get("WORKER_URL")
WORKER_AUTH_TOKEN = os.environ.get("WORKER_AUTH_TOKEN")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
FRONTEND_URL = "https://mindwise.pages.dev" # Your Cloudflare Pages domain

# --- Extensions Initialization ---
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

# Secure CORS policy: Only allow requests from your frontend domain
CORS(app, supports_credentials=True, resources={
    r"/api/*": {"origins": FRONTEND_URL}
})

# Rate Limiting to prevent abuse
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://" # For Fly.io, consider a Redis-based storage for multi-instance scaling
)

# --- AI Model Configuration ---
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
# NOTE: Remember to add 'sales_email' and 'website_url' columns to your 'users' table in the database.
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    client_id = db.Column(db.String(128), nullable=True)
    sales_email = db.Column(db.String(120), nullable=True)
    website_url = db.Column(db.String(255), nullable=True)

class Document(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    embedding = db.Column(Vector(768))
    client_id = db.Column(db.Text, nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- API V1: AUTHENTICATION ENDPOINTS ---

@app.route('/api/v1/auth/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email address already registered.'}), 409 # 409 Conflict

    password_hash = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()
    
    login_user(new_user)
    return jsonify({'success': True, 'message': 'Registration successful.'}), 201 # 201 Created

@app.route('/api/v1/auth/login', methods=['POST'])
@limiter.limit("10 per hour")
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({'success': True, 'message': 'Login successful.'}), 200
    
    return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401 # 401 Unauthorized

@app.route('/api/v1/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out successfully.'}), 200

# --- API V1: DASHBOARD ENDPOINTS ---

@app.route('/api/v1/dashboard/user-data', methods=['GET'])
@login_required
def get_user_data():
    """Provides essential user data to the frontend dashboard after login."""
    return jsonify({
        'email': current_user.email,
        'client_id': current_user.client_id,
        'sales_email': current_user.sales_email,
        'website_url': current_user.website_url
    }), 200

@app.route('/api/v1/dashboard/create-script', methods=['POST'])
@login_required
def create_script():
    website_url = request.json.get('website_url')
    if not website_url:
        return jsonify({'success': False, 'message': 'Website URL is required.'}), 400
    if not website_url.startswith('http'):
        website_url = 'https://' + website_url

    try:
        headers = {'Authorization': f'Bearer {WORKER_AUTH_TOKEN}'}
        payload = {'user_id': current_user.id, 'website_url': website_url}
        response = requests.post(f"{WORKER_URL}/process", json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Save the submitted URL to the user's profile
        current_user.website_url = website_url
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Your website is being processed! This can take a few minutes.'
        }), 202
    except requests.RequestException as e:
        logging.error(f"Failed to dispatch job to worker: {e}")
        return jsonify({'success': False, 'message': 'Failed to start the process. Please try again later.'}), 500

@app.route('/api/v1/dashboard/update-settings', methods=['POST'])
@login_required
def update_settings():
    data = request.json
    sales_email = data.get('sales_email')
    if not sales_email:
        return jsonify({'success': False, 'message': 'Sales email is required.'}), 400
    
    current_user.sales_email = sales_email
    db.session.commit()
    return jsonify({'success': True, 'message': 'Settings updated successfully.'}), 200


# --- API V1: PUBLIC CHATBOT ENDPOINT ---

@app.route('/api/v1/chatbot/ask', methods=['POST'])
@limiter.limit("60 per minute")
def ask_bot():
    data = request.json
    question = data.get('question')
    client_id = data.get('clientId')
    if not all([question, client_id, embedding_model]):
        return jsonify({'error': 'Missing data or embedding model not configured'}), 400

    try:
        question_embedding = genai.embed_content(
            model=embedding_model,
            content=question,
            task_type="RETRIEVAL_QUERY"
        )['embedding']

        relevant_docs = db.session.query(Document.content).filter(
            Document.client_id == client_id
        ).order_by(
            Document.embedding.l2_distance(question_embedding)
        ).limit(5).all()

        if not relevant_docs:
            return jsonify({"status": "human_handoff", "answer": "I couldn't find an answer in my knowledge base. Would you like to create a support ticket?"})

        context = "\n\n---\n\n".join([doc.content for doc in relevant_docs])
        prompt = f"""You are a helpful AI assistant. Answer the user's question based only on the context provided. Answer in a natural, conversational paragraph of 2-3 sentences. If the answer is not in the context, your entire response must be the single keyword: 'knowledge_gap'.

        --- CONTEXT ---
        {context}
        --- END CONTEXT ---

        User Question: {question}
        Answer:"""

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
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))