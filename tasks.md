# Tasks

> **Current focus:** Phase 1 content polish (contact details, display name), then Phase 2
>
> Legend: `- [ ]` todo · `- [x]` done · `- [~]` in progress / blocked (add a reason)
> Decisions behind these tasks are in [`decisions/`](decisions/README.md).

## Phase 0: Setup and documentation
- [x] Rename folder `potfolio-website` → `portfolio-website`
- [x] Create `CLAUDE.md`
- [x] Create `tasks.md`
- [x] Create `decisions/` with index, template and ADRs 0001–0007

## Phase 1: Static frontend + Docker + nginx + ngrok
- [x] Scaffold Vite + React (JS) + Tailwind in `frontend/`
- [x] `config/site.js`: profile overrides, socials, featured/hidden repos, skills
- [x] Data layer: `projectsService` + `githubSource` (sessionStorage cache) + `apiSource` stub
- [x] `useProjects` hook (loading / error / data)
- [x] Components: Navbar (dark-mode toggle), Hero/About, Projects + ProjectCard + language filter, Skills, Contact, Footer
- [x] Loading skeletons and error/rate-limit fallback
- [x] `frontend/Dockerfile` (multi-stage) + `nginx/default.conf` (SPA fallback, gzip, caching, `/api/` placeholder)
- [x] `docker-compose.yml` (web + ngrok, phase2/phase3 placeholders) + `.env.example`
- [x] `.gitignore`, `.dockerignore`
- [x] Verify `npm run build`
- [x] Verify `docker compose up --build`: localhost:8080 returns 200 and the SPA fallback works
- [x] Verify ngrok public URL (`.env` set up; URL changes on restart unless `NGROK_DOMAIN` is used)
- [x] LinkedIn link in `site.js` (Hero + Contact buttons)
- [ ] Fill in real email in `site.js`
- [ ] Review the featured repo list and add better descriptions on GitHub

## Tooling
- [x] `code-reviewer` subagent in `.claude/agents/`
- [x] Auto-review hooks (PostToolUse + FileChanged + SessionStart watch paths), reports in `.claude/reviews/`
- [ ] Confirm FileChanged fires for editor edits in a fresh session started from `portfolio-website/`

## Phase 2: FastAPI backend
- [x] Scaffold `backend/` (FastAPI, `app/main.py`, routers, settings via pydantic-settings)
- [ ] `GET /api/profile`, `GET /api/projects`: server-side GitHub fetch, optional `GITHUB_TOKEN`, TTL cache
- [ ] `POST /api/contact` (validate, then log or email)
- [ ] Backend Dockerfile + enable the `api` service in compose
- [ ] Uncomment the nginx `/api/` proxy, build the frontend with `VITE_DATA_SOURCE=api`
- [ ] Contact form component wired to `/api/contact`
- [ ] Health check `GET /api/health`, tests with pytest

## Phase 3: Postgres
- [ ] Enable the `db` service (postgres:16, named volume)
- [ ] SQLAlchemy models + Alembic migrations
- [ ] Persist contact messages
- [ ] Curated project metadata (custom blurb, screenshot, sort order) merged with GitHub data
- [ ] Simple view counter

## Phase 4: Backlog
- [ ] Admin page with auth for curated metadata
- [ ] GitHub Actions: build and push images
- [ ] Static ngrok domain or real hosting
- [ ] SEO / Open Graph meta, favicon, Lighthouse pass
