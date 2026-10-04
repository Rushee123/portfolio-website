# Decisions (ADRs)

Every non-trivial choice gets a short Architecture Decision Record. These keep the "why" in the repo, so a new session (human or Claude) can catch up without re-deriving it.

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [0001](0001-phased-architecture.md) | Phased architecture with a swappable data-source layer | Accepted | 2026-10-04 |
| [0002](0002-react-vite-javascript.md) | React + Vite with JavaScript | Accepted | 2026-10-04 |
| [0003](0003-tailwind-css.md) | Tailwind CSS for styling | Accepted | 2026-10-04 |
| [0004](0004-github-api-client-side.md) | Fetch GitHub data in the browser for Phase 1 | Accepted | 2026-10-04 |
| [0005](0005-docker-multistage-nginx.md) | Multi-stage Docker build, nginx serves static files | Accepted | 2026-10-04 |
| [0006](0006-ngrok-compose-service.md) | Run ngrok as a docker-compose service | Accepted | 2026-10-04 |
| [0007](0007-fastapi-postgres-later.md) | FastAPI + Postgres for Phases 2–3 | Accepted | 2026-10-04 |
| [0008](0008-auto-code-review-hook.md) | Automatic code review on file change (hook + subagent) | Accepted | 2026-10-04 |

## How to add one

1. Copy the template below to `NNNN-short-kebab-title.md` (next number).
2. Fill it in. Keep it short; links beat long text.
3. Add a row to the index above.
4. If it replaces an older ADR, set the old one's status to `Superseded by NNNN`. Don't delete it.

## Template

```markdown
# NNNN. Title

- **Status:** Proposed | Accepted | Superseded by NNNN
- **Date:** YYYY-MM-DD
- **Phase:** 0 | 1 | 2 | 3

## Context
What problem or force led to this decision?

## Decision
What we chose, stated plainly.

## Alternatives considered
- Option: why not

## Consequences
What gets easier, what gets harder, and what to revisit later.
```
