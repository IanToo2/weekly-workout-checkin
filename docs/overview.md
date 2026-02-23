# Overview

## Purpose

`weekly-workout-checkin` records daily workout check-ins and provides weekly goal status.

## Architecture

- Frontend: React + Vite
- Backend: Spring Boot REST API
- Database: Supabase Postgres
- Container runtime: Docker Compose

## Request Flow

1. Frontend sends requests to `/api/*`.
2. Frontend container (Nginx) proxies `/api` traffic to backend.
3. Backend reads/writes data to Supabase Postgres.
4. Backend returns JSON responses.

## Current Domain Rules

- 1 check-in per day
- Weekly target: 3 check-ins
- Weekly penalty when missed: KRW 10,000

See `docs/api.md` for API contract details.
