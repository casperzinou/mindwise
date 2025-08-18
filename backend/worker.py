import os
import re
import logging
from flask import Flask, request, jsonify
from sqlalchemy import create_engine, Column, Integer, String, BigInteger, Text, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy_pgvector.sqlalchemy import Vector
from bs4 import BeautifulSoup
import requests
from langchain.text_splitter import RecursiveCharacterTextSplitter
import google.generativeai as genai

# --- Basic Setup & Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)

# --- Environment Variables ---
DATABASE_URL = os.environ.get("DATABASE_URL")
WORKER_AUTH_TOKEN = os.environ.get("WORKER_AUTH_TOKEN") 
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# --- Database Connection ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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
# The worker needs to know the shape of our database tables.
class User(Base):
    __tablename__ = 'users'
    id = Column(BigInteger, primary_key=True)
    client_id = Column(String)

class Document(Base):
    __tablename__ = 'documents'
    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.id'))
    client_id = Column(Text, nullable=False)
    content = Column(Text)
    embedding = Column(Vector(768)) # 768 is the dimension for Gemini embeddings

# --- Helper Functions ---
def generate_collection_name(identifier: str):
    sanitized_name = re.sub(r'https?://', '', identifier)
    sanitized_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', sanitized_name)
    sanitized_name = sanitized_name.strip('_.')[:60]
    return f"{sanitized_name}_docs"

def scrape_text_from_url(url: str):
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        return soup.get_text(separator='\n', strip=True)
    except requests.RequestException as e:
        logging.error(f"Error scraping {url}: {e}")
        return ""

# --- Main Worker Endpoint ---
@app.route('/process', methods=['POST'])
def process_website():
    # 1. Authenticate the request
    auth_header = request.headers.get('Authorization')
    if not auth_header or auth_header.split(' ')[1] != WORKER_AUTH_TOKEN:
        return jsonify({"error": "Unauthorized"}), 401

    # 2. Get data from the request
    data = request.get_json()
    user_id = data.get('user_id')
    website_url = data.get('website_url')
    if not all([user_id, website_url]):
        return jsonify({"error": "Missing user_id or website_url"}), 400

    logging.info(f"Starting job for user_id: {user_id}, url: {website_url}")
    db_session = SessionLocal()
    
    try:
        # 3. Generate a client_id
        client_id = generate_collection_name(website_url)

        # 4. Scrape the website
        content = scrape_text_from_url(website_url)
        if not content:
            raise ValueError("Scraping returned no content.")
        
        # 5. Chunk the content
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)
        chunks = text_splitter.split_text(content)
        logging.info(f"Split content into {len(chunks)} chunks.")

        # 6. Generate embeddings for each chunk
        if not embedding_model:
            raise ValueError("Embedding model is not configured.")
        embeddings = genai.embed_content(model=embedding_model, content=chunks, task_type="RETRIEVAL_DOCUMENT")
        
        # 7. Create Document objects to be saved
        documents_to_add = []
        for i, chunk_text in enumerate(chunks):
            doc = Document(
                user_id=user_id,
                client_id=client_id,
                content=chunk_text,
                embedding=embeddings['embedding'][i]
            )
            documents_to_add.append(doc)
        
        # 8. Save all documents to the database in one transaction
        db_session.add_all(documents_to_add)
        logging.info(f"Prepared {len(documents_to_add)} documents for database insertion.")

        # 9. Update the user's record with the new client_id
        user = db_session.query(User).filter(User.id == user_id).first()
        if user:
            user.client_id = client_id
            logging.info(f"Updating user {user_id} with client_id {client_id}.")
        else:
            logging.error(f"Could not find user with id {user_id} to update.")
        
        # 10. Commit all changes
        db_session.commit()
        logging.info("Job completed successfully. All data committed to database.")
        
        return jsonify({"status": "success", "client_id": client_id}), 200

    except Exception as e:
        db_session.rollback()
        logging.error(f"Job failed for user {user_id}: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()

if __name__ == '__main__':
    # This allows running the worker locally for testing
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))