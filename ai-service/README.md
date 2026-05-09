# Sustainability Connect AI Service

FastAPI microservice for Phase 6 AI capabilities:

- content-aware recommendations
- semantic-style product search
- eco score generation
- embedding rebuild background tasks

## Setup

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --reload-exclude ".venv/*" --port 8000
```

On PowerShell, `copy .env.example .env` is the correct command. `py .env.example .env`
tries to run `.env.example` as a Python file.

Replace the placeholder `MONGODB_URI` in `.env` with your real MongoDB URI from the
backend `.env`. The placeholder host `cluster.mongodb.net` will fail because it is not
a real Atlas cluster address.

## APIs

```txt
GET  /health
POST /recommendations/{user_id}
POST /semantic-search
POST /eco-score/product
POST /embeddings/rebuild
```

The current implementation uses TF-IDF vectors for local semantic-style search and recommendations. It is intentionally shaped so it can later swap the embedding model for `sentence-transformers` and MongoDB Atlas Vector Search.
