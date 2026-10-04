# Backend (Phase 2, in progress)

FastAPI service. The app skeleton is in place (`app/main.py`, `app/settings.py`, `app/routers/`); endpoints come next. See `../decisions/0007-fastapi-postgres-later.md` and the Phase 2 tasks in `../tasks.md`.

## Run locally
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate # Git Bash; PowerShell: .venv\Scripts\Activate.ps1; macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload # http://localhost:8000/api/docs
```
Settings come from env vars or `backend/.env`: `GITHUB_USERNAME` (default `Rushee123`), `GITHUB_TOKEN` (optional), `DATABASE_URL` (Phase 3).

Docs live at `/api/docs` (not `/docs`) so they are reachable through the nginx `/api/` proxy.

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
