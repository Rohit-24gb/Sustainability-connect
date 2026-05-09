from collections import defaultdict
from math import sqrt

from app.models.ranking import EVENT_WEIGHTS


def build_user_profile(interactions: list[dict]) -> dict[str, float]:
    profile: dict[str, float] = defaultdict(float)

    for interaction in interactions:
        product_id = interaction.get("productId")
        if not product_id:
            continue

        event_type = interaction.get("eventType", "view")
        profile[str(product_id)] += interaction.get("scoreWeight") or EVENT_WEIGHTS.get(event_type, 0)

    return dict(profile)


def _actor_id(interaction: dict) -> str | None:
    user_id = interaction.get("userId")
    if user_id:
        return f"user:{user_id}"

    session_id = interaction.get("sessionId")
    if session_id:
        return f"session:{session_id}"

    return None


def _product_id(interaction: dict) -> str | None:
    product_id = interaction.get("productId")
    return str(product_id) if product_id else None


def _cosine(left: dict[str, float], right: dict[str, float]) -> float:
    dot = sum(value * right.get(product_id, 0) for product_id, value in left.items())
    left_norm = sqrt(sum(value * value for value in left.values()))
    right_norm = sqrt(sum(value * value for value in right.values()))

    if not left_norm or not right_norm or dot <= 0:
        return 0

    return dot / (left_norm * right_norm)


def build_collaborative_scores(
    all_interactions: list[dict],
    user_id: str,
    session_id: str | None = None,
) -> tuple[dict[str, float], dict[str, float]]:
    target_actor = f"user:{user_id}" if user_id else f"session:{session_id}"
    matrix: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    target_positive_ids: set[str] = set()

    for interaction in all_interactions:
        actor = _actor_id(interaction)
        product_id = _product_id(interaction)

        if not actor or not product_id:
            continue

        event_type = interaction.get("eventType", "view")
        weight = interaction.get("scoreWeight") or EVENT_WEIGHTS.get(event_type, 0)
        matrix[actor][product_id] += weight

        if actor == target_actor and weight > 0:
            target_positive_ids.add(product_id)

    target_vector = matrix.get(target_actor)
    if not target_vector:
        return {}, {"similarActors": 0, "maxActorSimilarity": 0}

    raw_scores: dict[str, float] = defaultdict(float)
    similar_actors = 0
    max_similarity = 0.0

    for actor, vector in matrix.items():
        if actor == target_actor:
            continue

        similarity = _cosine(target_vector, vector)

        if similarity <= 0:
            continue

        similar_actors += 1
        max_similarity = max(max_similarity, similarity)

        for product_id, weight in vector.items():
            if product_id in target_positive_ids or weight <= 0:
                continue

            raw_scores[product_id] += similarity * weight

    max_score = max(raw_scores.values(), default=1) or 1
    scores = {product_id: min(1, score / max_score) for product_id, score in raw_scores.items()}

    return scores, {
        "similarActors": similar_actors,
        "maxActorSimilarity": round(max_similarity, 4),
    }
