"""All API routes live under /api, so nginx can proxy that prefix to this service.

Add a router module here (health, projects, contact) and include it below.
"""

from fastapi import APIRouter

api_router = APIRouter(prefix="/api")
