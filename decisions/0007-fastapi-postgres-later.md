# 0007. FastAPI + Postgres for Phases 2–3

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 2–3 (decided now, built later)

## Context
Later phases need a backend (contact form, server-side GitHub fetch without rate limits) and a database (messages, curated project metadata).

## Decision
- Phase 2: Python FastAPI in `backend/`, served by uvicorn on port 8000. nginx proxies `/api/` to it, so there is one origin and no CORS. Endpoints: `/api/health`, `/api/profile`, `/api/projects`, `/api/contact`. The GitHub fetch moves server-side with an optional `GITHUB_TOKEN` and a TTL cache.
- Phase 3: Postgres 16 with a named volume, SQLAlchemy 2 and Alembic migrations.

## Alternatives considered
- Node/Express: same language as the frontend, but the user prefers Python. Their existing repos already use FastAPI (`ad_metrics_project`).

## Consequences
- The API must return the same normalized shapes as `githubSource.js` (see 0001).
- Compose gets `api` and `db` services. They are written down now as commented placeholders.
