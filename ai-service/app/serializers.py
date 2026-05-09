from datetime import datetime
from typing import Any

from bson import ObjectId


def serialize_mongo(value: Any) -> Any:
    if isinstance(value, ObjectId):
        return str(value)

    if isinstance(value, datetime):
        return value.isoformat()

    if isinstance(value, list):
        return [serialize_mongo(item) for item in value]

    if isinstance(value, dict):
        return {key: serialize_mongo(item) for key, item in value.items()}

    return value
