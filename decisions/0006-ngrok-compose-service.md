# 0006. Run ngrok as a docker-compose service

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 1

## Context
The site must be reachable publicly through ngrok.

## Decision
`docker-compose.yml` has an `ngrok` service (`ngrok/ngrok:latest`) that runs `http web:80`. `NGROK_AUTHTOKEN` comes from `.env`, which is gitignored. The inspector is published on `localhost:4040`. `NGROK_DOMAIN` is optional and enables a static domain (free accounts get one).

## Alternatives considered
- Running ngrok on the host: one more manual step, and it isn't versioned with the project.

## Consequences
- One `docker compose up` starts everything.
- On the free tier, browsers see a one-time ngrok warning page before the site.
- Without a static domain, the URL changes on every restart. Find it with `curl localhost:4040/api/tunnels`.
