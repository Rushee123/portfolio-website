# Backend (Phase 2, not built yet)

Planned FastAPI service. See `../decisions/0007-fastapi-postgres-later.md` and the Phase 2 tasks in `../tasks.md`.

## Planned layout
```
backend/
├── Dockerfile              # python:3.12-slim, uvicorn app.main:app --host 0.0.0.0 --port 8000
├── requirements.txt        # fastapi, uvicorn[standard], httpx, pydantic-settings (+ sqlalchemy, alembic, psycopg in Phase 3)
└── app/
    ├── main.py             # FastAPI app, include routers under /api
    ├── settings.py         # env: GITHUB_USERNAME, GITHUB_TOKEN, DATABASE_URL
    ├── routers/
    │   ├── health.py       # GET /api/health
    │   ├── projects.py     # GET /api/profile, GET /api/projects (GitHub + TTL cache)
    │   └── contact.py      # POST /api/contact
    └── db/                 # Phase 3: models, session, alembic migrations
```

## Contract
`/api/profile` and `/api/projects` must return the same normalized `Profile` / `Project` JSON as
`frontend/src/services/sources/githubSource.js` (camelCase keys). This lets the frontend switch over
by building with `VITE_DATA_SOURCE=api`.
