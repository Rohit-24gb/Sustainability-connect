from fastapi import APIRouter

from app.models.embedding_model import build_corpus, query_similarities
from app.models.ranking import reason_for_product
from app.pipelines.feature_builder import fetch_products
from app.schemas import SemanticSearchRequest
from app.serializers import serialize_mongo

router = APIRouter(tags=["semantic-search"])


@router.post("/semantic-search")
async def semantic_search(payload: SemanticSearchRequest) -> dict:
    filter_query: dict = {}

    if payload.category:
        filter_query["categoryID"] = payload.category

    if payload.minPrice is not None or payload.maxPrice is not None:
        filter_query["price"] = {}

        if payload.minPrice is not None:
            filter_query["price"]["$gte"] = payload.minPrice

        if payload.maxPrice is not None:
            filter_query["price"]["$lte"] = payload.maxPrice

    products = await fetch_products(filter_query)

    if not products:
        return {"success": True, "query": payload.query, "results": []}

    corpus = build_corpus(products)
    similarities = query_similarities(corpus, payload.query)
    ranked = []

    for product, similarity in zip(products, similarities):
        eco_bonus = (product.get("ecoScore") or 50) / 100 * 0.12
        carbon_bonus = max(0, 1 - ((product.get("carbonKgCO2e") or 5) / 10)) * 0.08
        score = float(similarity) + eco_bonus + carbon_bonus

        if score <= 0:
            continue

        ranked.append(
            {
                "product": serialize_mongo(product),
                "score": round(score, 4),
                "reasons": reason_for_product(product, float(similarity)),
            }
        )

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return {
        "success": True,
        "query": payload.query,
        "model": "tfidf-local-semantic",
        "results": ranked[: payload.limit],
    }
