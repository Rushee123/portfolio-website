# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# github (Phase 1) | api (Phase 2+). Baked in at build time; see decisions/0005.
ARG VITE_DATA_SOURCE=github
ENV VITE_DATA_SOURCE=$VITE_DATA_SOURCE
RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
