# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here (context management)

1. Read `tasks.md` for the current phase and the next open tasks.
2. Read `decisions/README.md` for the index of past decisions. Open individual ADRs only when relevant.
3. When you finish a task, tick it in `tasks.md`. When you make a non-trivial choice, add an ADR in `decisions/` and a line to its index.

## What this is

A portfolio site that shows the GitHub repos of `Rushee123`. It is built in phases:

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Docs, tasks, decisions | done |
| 1 | React + Vite + Tailwind frontend, served by nginx in Docker, exposed via ngrok. GitHub data fetched in the browser | in progress |
| 2 | FastAPI backend (`backend/`), nginx proxies `/api/` | planned |
| 3 | Postgres via SQLAlchemy + Alembic | planned |

## Architecture rule

Components never call `fetch` directly. They go through `frontend/src/services/projectsService.js`, which picks a source using `VITE_DATA_SOURCE`:
- `github` (Phase 1) → `sources/githubSource.js` calls api.github.com, cached in sessionStorage
- `api` (Phase 2+) → `sources/apiSource.js` calls `/api/*`

Both sources return the same normalized shapes (see the JSDoc in `projectsService.js`). Keep it that way so switching phases needs no component changes.

User-editable content (bio, socials, featured/hidden repos, skills) lives in `frontend/src/config/site.js`.

## Commands

```bash
# Local dev (http://localhost:5173)
cd frontend && npm install && npm run dev
npm run build            # production build to frontend/dist

# Docker (site on http://localhost:8080, ngrok inspector on http://localhost:4040)
cp .env.example .env     # then set NGROK_AUTHTOKEN
docker compose up --build -d
docker compose logs -f ngrok
curl -s localhost:4040/api/tunnels   # shows the public URL
docker compose down
```

No tests or linter are set up yet.

## Automatic code review

Every changed source file is reviewed in the background by the `code-reviewer` subagent (`.claude/agents/code-reviewer.md`). Reports go to `.claude/reviews/<path>.md`, and reports with findings are fed back into context on the next hook event. When that happens, fix the real issues or explain why a finding doesn't apply. Details are in `decisions/0008-auto-code-review-hook.md`.
