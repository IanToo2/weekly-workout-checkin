# Runbook

Operational baseline for Supabase (Postgres) + Docker Compose (`frontend`/`backend`).

## Ownership

| Area | Primary | Backup | Responsibility |
| --- | --- | --- | --- |
| DB (Supabase) | Platform/Infra Owner | Assigned Backup | DB access policy, incidents, backup/recovery policy |
| Migration (Flyway) | Platform/Infra Owner | Assigned Backup | Migration sequence, validation, rollback strategy |
| API sync impact | FE Owner + BE Owner | Assigned Backup | FE/BE compatibility for contract changes |

## Runtime Model

- Database runs on Supabase (managed external Postgres).
- Application services run via Docker Compose.
- Backend reads DB config from `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

## Quick Commands

Start:

```bash
docker compose up --build -d
```

Logs:

```bash
docker compose logs -f backend frontend
```

Health check:

```bash
curl http://localhost:8080/api/health
```

Stop:

```bash
docker compose down
```

## Incident First Response

1. `/api/health` fails.
- Check backend container state.
- Check backend logs for DB auth/network errors.

2. DB connection errors increase.
- Recheck `.env` Supabase values.
- Check free-tier pause/usage limits.
- Rotate DB password if needed and redeploy.

3. CORS failures.
- Verify `CORS_ALLOWED_ORIGINS` includes the real frontend origin.
- Restart containers after updates.

## Migration Policy

- Apply schema changes only through Flyway SQL files in `backend/src/main/resources/db/migration`.
- Do not apply manual DDL changes directly in DB consoles.
- If API contract changes, update `docs/api.md` in the same PR.

## Rollback Rules

- Decide app rollback and DB rollback separately.
- On migration failures, stop rollout and choose roll-forward or recovery SQL.
- Register at least one prevention action after incidents (test, monitoring, or guardrail).
