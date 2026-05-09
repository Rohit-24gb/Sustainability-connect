from app.pipelines.train_recommender import build_product_embedding_index


async def rebuild_embeddings_task() -> dict:
    return await build_product_embedding_index()
