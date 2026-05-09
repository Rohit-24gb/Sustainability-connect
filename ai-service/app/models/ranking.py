from __future__ import annotations


EVENT_WEIGHTS = {
    "view": 1,
    "search": 2,
    "search_click": 2,
    "cart_add": 4,
    "cart_remove": -2,
    "purchase": 8,
    "wishlist": 3,
}


def normalize(value: float, max_value: float = 100) -> float:
    if max_value <= 0:
        return 0
    return max(0, min(1, value / max_value))


def hybrid_score(
    content_similarity: float,
    collaborative_score: float = 0,
    eco_score: float = 50,
    popularity: float = 0,
    freshness: float = 0,
) -> float:
    return (
        0.35 * content_similarity
        + 0.25 * collaborative_score
        + 0.20 * normalize(eco_score)
        + 0.10 * popularity
        + 0.10 * freshness
    )


def reason_for_product(product: dict, similarity: float) -> list[str]:
    reasons: list[str] = []

    if similarity > 0.25:
        reasons.append("Matches your product intent")

    if (product.get("ecoScore") or 0) >= 75:
        reasons.append("High sustainability score")

    if (product.get("carbonKgCO2e") or 99) <= 2:
        reasons.append("Lower estimated carbon footprint")

    if product.get("recyclable"):
        reasons.append("Recyclable product attributes")

    return reasons or ["Relevant sustainable product match"]
