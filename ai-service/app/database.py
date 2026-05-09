from motor.motor_asyncio import AsyncIOMotorClient

from app.config import get_settings

settings = get_settings()
client: AsyncIOMotorClient | None = None


def get_database():
    global client

    if client is None:
        client = AsyncIOMotorClient(settings.mongodb_uri)

    return client[settings.mongodb_db]


async def close_database() -> None:
    if client is not None:
        client.close()
