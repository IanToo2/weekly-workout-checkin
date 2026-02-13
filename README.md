# Fitness Check-in Toy Project

Small group workout check-in service.

## Stack
- Frontend: React + TypeScript (Vite-compatible structure)
- Backend: Java 17 + Spring Boot 3
- DB: PostgreSQL

## Rule Set
- One check-in per day per member
- Weekly target: 3 check-ins
- Week window: Monday 00:00:00 to Sunday 23:59:59
- Weekly fine: KRW 10,000 if a member has fewer than 3 check-ins

## Run PostgreSQL
```bash
docker compose up -d
```

## Backend Run
```bash
cd backend
./mvnw spring-boot:run
```
If `mvnw` is not present in your local setup, use your local Maven install:
```bash
mvn spring-boot:run
```

## Frontend Run
```bash
cd frontend
npm install
npm run dev
```

## Initial API
- `GET /api/health`
- `GET /api/rules`
