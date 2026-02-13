---
name: fitness-weekly-checkin
description: Build and iterate a small workout check-in MVP (React+TS, Spring Boot, PostgreSQL) with fixed weekly rules.
metadata:
  short-description: Workout check-in MVP workflow
---

# Fitness Weekly Check-in

Create and evolve this toy project quickly with minimal ceremony.

## Trigger

Use this skill when the task is about this project: weekly workout check-ins, weekly pass/fail, or KRW 10,000 penalty logic.

## Fixed Rules

- Allow at most one check-in per member per day.
- Require at least 3 check-ins per week.
- Week is Monday to Sunday.
- Apply KRW 10,000 fine when weekly count is below 3.

## Workflow

1. Freeze contract first.
- Confirm API request/response fields before editing UI or service logic.
- Keep rule constants centralized in backend service.
- Keep request and response examples in the task note before coding.

2. Implement backend before frontend wiring.
- Add or update JPA entities and repository constraints.
- Expose only required endpoints under `/api`.
- Return deterministic validation errors for duplicate daily check-in.

3. Wire frontend to real API.
- Keep API calls in `frontend/src/api.ts`.
- Keep rule display and weekly status visible on first screen.

4. Verify core paths.
- Health check returns `ok`.
- Duplicate same-day check-in is rejected.
- Weekly status reflects Monday-Sunday window and fine amount.

5. Document only run-critical info.
- Update root `README.md` run steps if command or env changes.

6. Finish task with git publish.
- Work only in the assigned role branch.
- Run `git status --short` and review changed files.
- Commit with clear message: `feat|fix|chore(scope): summary`.
- Push branch: `git push origin <role-branch>`.
- Share commit hash and PR URL (or PR create command) in task result.

## Collaboration Mode (Worktree)

- Planner worktree: `worktrees/planner` on `role/planner`
- Backend worktree: `worktrees/backend` on `role/backend`
- Frontend worktree: `worktrees/frontend` on `role/frontend`
- QA worktree: `worktrees/qa` on `role/qa`
- Merge order: `role/planner` -> `role/backend` -> `role/frontend` -> `role/qa` -> `main`

## File Targets

- Backend: `backend/src/main/java/com/toyproject/fitness/checkin/`
- Backend config: `backend/src/main/resources/application.yml`
- Frontend app: `frontend/src/`
- Infra: `docker-compose.yml`

## Guardrails

- Do not add heavy architecture or extra services unless asked.
- Prefer small, reversible edits and keep naming explicit.
- Keep dependencies minimal.
- Do not push to `main` directly from role worktrees.
