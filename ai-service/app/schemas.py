from typing import Any, Optional

from pydantic import BaseModel, Field


class ProductPayload(BaseModel):
    name: str = ""
    description: str = ""
    price: float = 0
    categoryID: Optional[int] = None
    ecoScore: Optional[float] = None
    carbonKgCO2e: Optional[float] = None
    materials: list[str] = Field(default_factory=list)
    packagingType: str = "standard"
    recyclable: bool = False
    durabilityScore: float = 50
    certifications: list[str] = Field(default_factory=list)


class RecommendationRequest(BaseModel):
    limit: int = 8
    sessionId: Optional[str] = None


class SemanticSearchRequest(BaseModel):
    query: str
    category: Optional[int] = None
    minPrice: Optional[float] = None
    maxPrice: Optional[float] = None
    limit: int = 20


class EcoScoreRequest(ProductPayload):
    metadata: dict[str, Any] = Field(default_factory=dict)


class EmbeddingRebuildRequest(BaseModel):
    force: bool = False
    batchSize: int = 100
