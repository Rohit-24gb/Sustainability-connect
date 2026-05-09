from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class EmbeddedCorpus:
    ids: list[str]
    matrix: Any
    vectorizer: TfidfVectorizer


def product_text(product: dict) -> str:
    materials = " ".join(product.get("materials") or [])
    certifications = " ".join(product.get("certifications") or [])
    return " ".join(
        str(value or "")
        for value in [
            product.get("name"),
            product.get("description"),
            product.get("categoryID"),
            materials,
            product.get("packagingType"),
            certifications,
            "recyclable" if product.get("recyclable") else "",
            "low carbon" if (product.get("carbonKgCO2e") or 99) <= 2 else "",
            "high eco score" if (product.get("ecoScore") or 0) >= 75 else "",
        ]
    )


def build_corpus(products: list[dict]) -> EmbeddedCorpus:
    ids = [str(product["_id"]) for product in products]
    documents = [product_text(product) for product in products]
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), min_df=1)
    matrix = vectorizer.fit_transform(documents)
    return EmbeddedCorpus(ids=ids, matrix=matrix, vectorizer=vectorizer)


def query_similarities(corpus: EmbeddedCorpus, query: str) -> np.ndarray:
    query_vector = corpus.vectorizer.transform([query])
    return cosine_similarity(query_vector, corpus.matrix).flatten()
