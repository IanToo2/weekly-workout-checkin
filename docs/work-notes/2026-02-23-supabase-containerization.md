# Supabase + Containerization Update (2026-02-23)

## Goal
Switch database connectivity to Supabase Postgres and run FE/BE with Docker Compose for integrated local monitoring.

## Scope
- Externalize backend DB/CORS settings through environment variables.
- Add backend/frontend Dockerfiles and update compose to run FE+BE containers.
- Update project docs to reflect Supabase-first runtime.

## Done Criteria
- `docker compose up --build` starts frontend and backend services.
- Backend connects with `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
- Docs explain Supabase env setup, startup, and monitoring commands.

## Risks
- Wrong Supabase JDBC or credentials can block backend startup.
- Free tier quotas and paused projects can impact uptime.
- CORS origins must match actual frontend host(s).

## TODO
- [ ] Supabase DB not yet created (blocked item).
- [ ] Create Supabase project and fill `.env` with real credentials.
- [ ] Re-run backend/frontend validation after local toolchain issues are resolved.
- [ ] Run `docker compose up --build` and capture runtime health logs.
