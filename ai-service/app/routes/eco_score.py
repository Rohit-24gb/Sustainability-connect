from fastapi import APIRouter

from app.schemas import EcoScoreRequest

router = APIRouter(tags=["eco-score"])

MATERIAL_SCORES = {
    "bamboo": 95,
    "organic": 90,
    "cotton": 78,
    "recycled": 88,
    "paper": 72,
    "glass": 82,
    "steel": 80,
    "jute": 88,
    "plastic": 28,
    "polyester": 34,
}

PACKAGING_SCORES = {
    "none": 95,
    "plastic-free": 92,
    "compostable": 90,
    "recycled": 84,
    "paper": 76,
    "minimal": 82,
    "standard": 55,
    "plastic": 28,
}

WEAK_CLAIMS = ["green", "eco-friendly", "natural", "planet friendly", "chemical free"]
STRONG_CLAIMS = ["certified", "organic", "recycled", "plastic-free", "compostable", "fsc", "fair trade"]


def carbon_score(carbon: float) -> float:
    if carbon <= 0.5:
        return 95
    if carbon <= 1:
        return 86
    if carbon <= 2:
        return 72
    if carbon <= 5:
        return 52
    if carbon <= 10:
        return 34
    return 18


def extract_claims(text: str) -> dict:
    normalized = text.lower()
    weak = [claim for claim in WEAK_CLAIMS if claim in normalized]
    strong = [claim for claim in STRONG_CLAIMS if claim in normalized]
    return {
        "strongClaims": strong,
        "weakClaims": weak,
        "greenwashingRisk": "medium" if weak and not strong else "low",
    }


@router.post("/eco-score/product")
async def eco_score_product(payload: EcoScoreRequest) -> dict:
    materials = payload.materials or []
    material_values = [MATERIAL_SCORES.get(material.lower(), 55) for material in materials]
    material_score = sum(material_values) / len(material_values) if material_values else 55
    packaging_score = PACKAGING_SCORES.get(payload.packagingType.lower(), 55)
    recyclability_score = 90 if payload.recyclable else 35
    durability_score = max(0, min(100, payload.durabilityScore))
    carbon_component = carbon_score(payload.carbonKgCO2e or 1.5)

    eco_score = round(
        material_score * 0.30
        + packaging_score * 0.20
        + recyclability_score * 0.20
        + durability_score * 0.15
        + carbon_component * 0.15
    )

    claims = extract_claims(f"{payload.name} {payload.description}")
    explanation = (
        f"{payload.name or 'This product'} scores {eco_score}/100 because materials score "
        f"{round(material_score)}, packaging scores {round(packaging_score)}, recyclability is "
        f"{'strong' if payload.recyclable else 'limited'}, durability is {round(durability_score)}, "
        f"and estimated emissions are {payload.carbonKgCO2e or 1.5} kg CO2e."
    )

    return {
        "success": True,
        "ecoProfile": {
            "ecoScore": eco_score,
            "materialScore": round(material_score, 2),
            "packagingScore": packaging_score,
            "recyclabilityScore": recyclability_score,
            "durabilityScore": durability_score,
            "carbonScore": carbon_component,
            "impactExplanation": explanation,
            **claims,
        },
    }
