from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.conversations import router as conversations_router
from app.api.routes.documents import router as documents_router
from app.api.routes.stats import router as stats_router
from app.core.config import get_settings

app = FastAPI(title="Almamlaka Assistant API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(conversations_router)
app.include_router(documents_router)
app.include_router(stats_router)


@app.get("/health")
def health():
    settings = get_settings()
    return {"status": "ok", "openai_key_loaded": bool(settings.openai_api_key)}
