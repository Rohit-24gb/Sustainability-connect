from fastapi import APIRouter, BackgroundTasks

from app.schemas import EmbeddingRebuildRequest
from app.workers.tasks import rebuild_embeddings_task

router = APIRouter(tags=["embeddings"])

embedding_jobs: list[dict] = []


async def run_rebuild_job(payload: EmbeddingRebuildRequest) -> None:
    result = await rebuild_embeddings_task()
    embedding_jobs.append({"status": "completed", "force": payload.force, **result})


@router.post("/embeddings/rebuild")
async def rebuild_embeddings(payload: EmbeddingRebuildRequest, background_tasks: BackgroundTasks) -> dict:
    background_tasks.add_task(run_rebuild_job, payload)
    return {
        "success": True,
        "message": "Embedding rebuild queued",
        "worker": "fastapi-background-task",
    }


@router.get("/embeddings/jobs")
async def embedding_job_status() -> dict:
    return {"success": True, "jobs": embedding_jobs[-10:]}
