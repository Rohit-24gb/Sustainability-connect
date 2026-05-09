from bson import ObjectId

from app.database import get_database


async def fetch_products(filter_query: dict | None = None, limit: int | None = None) -> list[dict]:
    db = get_database()
    cursor = db.products.find(filter_query or {})

    if limit:
        cursor = cursor.limit(limit)

    return await cursor.to_list(length=limit or 1000)


async def fetch_user_interactions(user_id: str, limit: int = 100) -> list[dict]:
    db = get_database()
    query = {"userId": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"userId": user_id}
    return await db.interactions.find(query).sort("timestamp", -1).limit(limit).to_list(length=limit)


async def fetch_all_interactions(limit: int = 5000) -> list[dict]:
    db = get_database()
    return await db.interactions.find({"productId": {"$ne": None}}).sort("timestamp", -1).limit(limit).to_list(length=limit)


async def fetch_product_by_ids(product_ids: list[str]) -> list[dict]:
    db = get_database()
    object_ids = [ObjectId(product_id) for product_id in product_ids if ObjectId.is_valid(product_id)]
    if not object_ids:
        return []
    return await db.products.find({"_id": {"$in": object_ids}}).to_list(length=len(object_ids))
