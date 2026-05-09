from app.models.embedding_model import build_corpus
from app.pipelines.feature_builder import fetch_products


async def build_product_embedding_index() -> dict:
    products = await fetch_products()

    if not products:
        return {"indexedCount": 0}

    corpus = build_corpus(products)
    return {
        "indexedCount": len(corpus.ids),
        "model": "tfidf-local",
        "dimensions": len(corpus.vectorizer.get_feature_names_out()),
    }
