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

4. Confirm git collaboration layout.
- Run `git worktree list` and verify planner/backend/frontend/qa worktrees exist.
- Run `git branch --list` and verify `role/planner`, `role/backend`, `role/frontend`, `role/qa`.

5. Confirm push readiness.
- For each role branch, set upstream once: `git push -u origin role/<name>`.
- Ensure `git status --short` is clean before starting a new task.

## Worktree Paths

- Planner: `worktrees/planner`
- Backend: `worktrees/backend`
- Frontend: `worktrees/frontend`
- QA: `worktrees/qa`

## Quick Checks

- Backend port: `8080`
- Frontend port: `5173`
- PostgreSQL port: `5432`

## Guardrails

- Do not add new infra unless asked.
- If startup fails, report exact command and error first.
- Do not commit or push from `main` for role tasks.
