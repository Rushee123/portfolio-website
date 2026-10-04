# 0002. React + Vite with JavaScript

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 1

## Context
We need a frontend that is quick to build now and can grow into a client for a real API later.

## Decision
React 18 with the Vite bundler, written in plain JavaScript (`.jsx`). The user chose JS over TypeScript to keep it simple. Data shapes are documented with JSDoc instead.

## Alternatives considered
- Plain HTML/CSS/JS: harder to organize as the site grows.
- Astro / Next.js: more than a static SPA behind nginx needs.
- TypeScript: declined for now. It could be adopted later file by file, since Vite supports mixed JS/TS.

## Consequences
- Vite outputs a static `dist/` that nginx serves directly.
- There is no type safety. Keep the normalized data shapes documented in `projectsService.js`.
