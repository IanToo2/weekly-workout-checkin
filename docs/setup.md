# Setup

This document defines the Supabase + Docker Compose setup for this project.

## Baseline

- Docker and Docker Compose
- Supabase project (Postgres enabled)
- Java 17 (if running backend locally)
- Node.js 20 LTS (if running frontend locally)

## Environment Variables

Create `.env` in the repository root:

```env
DB_URL=jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres.<project-ref>
DB_PASSWORD=<your-db-password>
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Notes:
- `DB_URL` must be a JDBC URL.
- Supabase typically requires SSL, so keep `sslmode=require`.
- `CORS_ALLOWED_ORIGINS` supports comma-separated origins.

## Start Containerized FE/BE

```bash
docker compose up --build
```

Endpoints:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api/*`

Logs:

```bash
docker compose logs -f backend frontend
```

Stop:

```bash
docker compose down
```

## Optional Local Start

Backend:

```bash
cd backend
./mvnw spring-boot:run
```

Frontend:

```bash
cd frontend
npm ci
npm run dev
```

## Validation

Backend:

```bash
cd backend
./mvnw test
```

Frontend:

```bash
cd frontend
npm run build
```

## Troubleshooting

1. Backend fails with DB connection errors.
- Check `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
- Verify Supabase project is not paused.
- Check outbound network/firewall rules.

2. Browser shows CORS errors.
- Ensure the frontend origin is included in `CORS_ALLOWED_ORIGINS`.
- Rebuild/restart containers.

3. Frontend cannot call `/api/*`.
- Check backend logs.
- Check backend health endpoint.

## Validation Log (2026-02-23)

Executed in order:

1. `.env` bootstrap
- `Copy-Item .env.example .env`
- Result: success

2. Frontend dependency and build
- `npm ci` -> failed (`npm.ps1` blocked by PowerShell execution policy)
- `npm.cmd ci` -> failed (EACCES/EPERM during install and package fetch)
- `npm.cmd run build` -> failed (`tsc` not found because dependencies were not installed)

3. Backend test
- `./mvnw test` -> failed (`JAVA_HOME` missing)
- retry with `JAVA_HOME` set -> wrapper then failed with local Maven cache write permission (`AccessDeniedException` on `.m2`)

4. Docker runtime
- `docker --version` and `docker compose up --build` -> failed (`docker` command not found)

Current conclusion:
- Project structure and config are updated for Supabase + FE/BE containers.
- Runtime verification is blocked by host environment/tooling constraints.

## TODO (Pending Supabase Provisioning)

- [ ] Create Supabase project and provision Postgres instance.
- [ ] Replace placeholders in `.env`:
  - [ ] `DB_URL`
  - [ ] `DB_USERNAME`
  - [ ] `DB_PASSWORD`
- [ ] Install/verify local runtime tools:
  - [ ] Docker Desktop (`docker`, `docker compose`)
  - [ ] Java 17 + `JAVA_HOME`
  - [ ] Node.js/npm with package registry access
- [ ] Re-run validation gate:
  - [ ] `cd backend && ./mvnw test`
  - [ ] `cd frontend && npm ci && npm run build`
- [ ] Start integrated runtime:
  - [ ] `docker compose up --build`
  - [ ] Verify `http://localhost:8080/api/health`
