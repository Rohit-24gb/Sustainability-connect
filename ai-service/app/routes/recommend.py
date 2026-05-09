from bson import ObjectId
from fastapi import APIRouter

from app.models.collaborative import build_collaborative_scores, build_user_profile
from app.models.embedding_model import build_corpus, product_text, query_similarities
from app.models.ranking import hybrid_score, reason_for_product
from app.pipelines.feature_builder import fetch_all_interactions, fetch_product_by_ids, fetch_products, fetch_user_interactions
from app.schemas import RecommendationRequest
from app.serializers import serialize_mongo

router = APIRouter(tags=["recommendations"])


@router.post("/recommendations/{user_id}")
async def recommendations(user_id: str, payload: RecommendationRequest) -> dict:
    interactions = await fetch_user_interactions(user_id)
    products = await fetch_products()
    all_interactions = await fetch_all_interactions()

    if not products:
        return {"success": True, "recommendations": []}

    profile = build_user_profile(interactions)

    if not profile:
        fallback = sorted(products, key=lambda item: (item.get("ecoScore") or 50, item.get("productID") or 0), reverse=True)
        return {
            "success": True,
            "strategy": "eco-cold-start",
            "recommendations": [
                {
                    "product": serialize_mongo(product),
                    "score": round((product.get("ecoScore") or 50) / 100, 4),
                    "reasons": reason_for_product(product, 0),
                }
                for product in fallback[: payload.limit]
            ],
        }

    source_products = await fetch_product_by_ids(list(profile.keys()))
    weighted_intent = " ".join(
        " ".join([product_text(product)] * max(1, int(abs(profile.get(str(product["_id"]), 1)))))
        for product in source_products
    )

    corpus = build_corpus(products)
    similarities = query_similarities(corpus, weighted_intent)
    collaborative_scores, collaborative_meta = build_collaborative_scores(
        all_interactions,
        user_id=user_id,
        session_id=payload.sessionId,
    )
    seen_ids = {ObjectId(product_id) for product_id in profile if ObjectId.is_valid(product_id)}
    ranked = []

    for product, similarity in zip(products, similarities):
        if product["_id"] in seen_ids and profile.get(str(product["_id"]), 0) > 0:
            continue

        collaborative_score = collaborative_scores.get(str(product["_id"]), 0)
        score = hybrid_score(
            content_similarity=float(similarity),
            collaborative_score=collaborative_score,
            eco_score=product.get("ecoScore") or 50,
            popularity=0,
            freshness=min(1, (product.get("productID") or 0) / 100),
        )
        reasons = reason_for_product(product, float(similarity))

        if collaborative_score > 0:
            reasons.insert(0, "Users with similar eco-shopping activity also interacted with this")

        ranked.append(
            {
                "product": serialize_mongo(product),
                "score": round(score, 4),
                "rankingSignals": {
                    "contentSimilarity": round(float(similarity), 4),
                    "collaborativeScore": round(collaborative_score, 4),
                    "ecoScore": round((product.get("ecoScore") or 50) / 100, 4),
                    "popularity": 0,
                    "freshness": round(min(1, (product.get("productID") or 0) / 100), 4),
                },
                "reasons": reasons[:3],
            }
        )

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return {
        "success": True,
        "strategy": "hybrid-content-collaborative-eco",
        "formula": "0.35 content + 0.25 collaborative + 0.20 eco + 0.10 popularity + 0.10 freshness",
        "collaborative": collaborative_meta,
        "recommendations": ranked[: payload.limit],
    }
