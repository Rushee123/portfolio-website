# 0001. Phased architecture with a swappable data-source layer

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 0

## Context
Phase 1 has no backend, but Phases 2–3 add FastAPI and Postgres. We want to add those without rewriting the UI.

## Decision
- Components get data only through `frontend/src/services/projectsService.js` (`getProfile()`, `getProjects()`).
- The service picks a source module using the build-time env var `VITE_DATA_SOURCE`:
  - `github` → `sources/githubSource.js` (Phase 1)
  - `api` → `sources/apiSource.js`, which calls `/api/*` on the same origin (Phase 2+)
- Both sources return the same normalized objects (documented in JSDoc in `projectsService.js`).
- Featured/hidden filtering and sorting happen in `projectsService`, so they apply to both sources.
- nginx already has a commented `/api/` proxy block, and compose has commented `api`/`db` services.

## Alternatives considered
- Call GitHub directly in components: fastest to write, but Phase 2 would mean editing every component.
- Build the backend now: the user explicitly doesn't need one yet.

## Consequences
- Moving to Phase 2 is a config change plus the backend itself.
- Each source must keep to the normalized shape. Any change to the shape has to be made in both sources.
