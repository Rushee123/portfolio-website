# 0004. Fetch GitHub data in the browser for Phase 1

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 1

## Context
Without a backend, project data has to come from somewhere at runtime or at build time.

## Decision
The browser calls the public GitHub REST API:
- `GET https://api.github.com/users/Rushee123` (profile)
- `GET https://api.github.com/users/Rushee123/repos?per_page=100&sort=updated`

Responses are cached in `sessionStorage` for 1 hour. Forks and `hiddenRepos` are filtered out, and `featuredRepos` are listed first (config in `site.js`).

## Alternatives considered
- Snapshot at Docker build time: no rate limit, but stale until the next rebuild.
- Hand-written list: full control, but nothing updates automatically.

## Consequences
- Unauthenticated limit of 60 requests/hour per visitor IP. One page view uses 2 requests, and the cache cuts down repeats.
- When the limit is hit, the UI shows a friendly error with a link to the GitHub profile.
- No token can be used in the browser, because it would be exposed. Phase 2 moves the fetch server-side with an optional `GITHUB_TOKEN` (see 0007).
