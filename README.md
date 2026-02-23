# Weekly Workout Check-in

A small service to record daily workout check-ins and track weekly goal completion.

## Runtime Direction

- Database: Supabase Postgres (managed external DB)
- App runtime: Docker Compose (`frontend` + `backend`)
- API base path: `/api`

## Quick Start (Supabase + Docker)

1. Create a Supabase project and collect DB connection values.
2. Create `.env` in the repository root.

```bash
cp .env.example .env
```

3. Fill `.env` with real values.

```env
DB_URL=jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres.<project-ref>
DB_PASSWORD=<your-db-password>
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

4. Start services.

```bash
docker compose up --build
```

5. Open endpoints.
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:8080/api/health`

## Local Development (optional)

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

## Validation Gate

Backend changes:

```bash
cd backend
./mvnw test
```

Frontend changes:

```bash
cd frontend
npm run build
```

## Documentation

- Architecture: `docs/overview.md`
- Setup: `docs/setup.md`
- Runbook: `docs/runbook.md`
- API Contract: `docs/api.md`
- ADR Guide: `docs/adr/README.md`
- Changelog: `docs/changelog.md`
- Working rules: `AGENTS.md`
