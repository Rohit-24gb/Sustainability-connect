from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import close_database
from app.routes import eco_score, embeddings, recommend, search

settings = get_settings()

app = FastAPI(title=settings.ai_service_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router)
app.include_router(search.router)
app.include_router(eco_score.router)
app.include_router(embeddings.router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": settings.ai_service_name}


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await close_database()
