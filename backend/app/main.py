"""FastAPI entry point. Run with: uvicorn app.main:app --reload"""

from fastapi import FastAPI

from app.routers import api_router

app = FastAPI(
    title="Portfolio API",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url=None,
)

app.include_router(api_router)
