# 0005. Multi-stage Docker build, nginx serves static files

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 1

## Context
The site must run in a Docker container with nginx serving it.

## Decision
`frontend/Dockerfile`:
1. `node:20-alpine` stage runs `npm ci && npm run build`. `VITE_DATA_SOURCE` is passed in as a build arg.
2. `nginx:alpine` stage copies `dist/` and `nginx/default.conf`.

The nginx config has an SPA fallback (`try_files $uri /index.html`), gzip, long-lived cache headers for hashed `/assets/` and no-cache for `index.html`. It also has a commented `/api/` → `api:8000` proxy for Phase 2.

## Alternatives considered
- Serving with `vite preview` or Node: not meant for production, and not what was asked for.
- Copying a locally built `dist/`: depends on whatever is installed on the host.

## Consequences
- The final image has no Node in it, which keeps it small.
- `VITE_*` variables are baked in at build time. Changing the data source means rebuilding the image.
