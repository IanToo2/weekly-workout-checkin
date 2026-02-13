---
name: project-bootstrap
description: Fast local bootstrap for this toy project (React+TS frontend, Spring backend, PostgreSQL).
metadata:
  short-description: Run local stack quickly
---

# Project Bootstrap

Use this skill when starting local development or onboarding.

## Steps

1. Start database.
- Run `docker compose up -d` from repo root.

2. Start backend.
- Run `cd backend` then `mvn spring-boot:run`.
- Verify `GET /api/health` returns `{"status":"ok"}`.

3. Start frontend.
- Run `cd frontend` then `npm install` and `npm run dev`.
- Verify app loads and can read `/api/rules`.

## Quick Checks

- Backend port: `8080`
- Frontend port: `5173`
- PostgreSQL port: `5432`

## Guardrails

- Do not add new infra unless asked.
- If startup fails, report exact command and error first.
