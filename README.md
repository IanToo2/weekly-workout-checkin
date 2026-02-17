# Weekly Workout Check-in

소그룹 운동 체크인을 기록하고 주간 목표 달성 여부를 확인하는 토이 프로젝트입니다.

## Quick Start

1. PostgreSQL 실행
```bash
docker compose up -d
```

2. Backend 실행 (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
Windows (PowerShell):
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

3. Frontend 실행 (Vite)
```bash
cd frontend
npm install
npm run dev
```

## Documentation Index

- 프로젝트 개요/구조: `docs/overview.md`
- 로컬 환경/실행/트러블슈팅: `docs/setup.md`
- API 계약(요청/응답 예시): `docs/api.md`
- 도메인 규칙: `docs/rules.md`
- 개발 워크플로/PR 규칙: `docs/development-workflow.md`
- 운영 대응 런북: `docs/runbook.md`
- ADR 가이드: `docs/adr/README.md`
- 문서 변경 이력: `docs/changelog.md`
- 에이전트/개발 작업 규약: `AGENTS.md`

## Current Scope

현재 구현된 API:
- `GET /api/health`
- `GET /api/rules`
- `POST /api/checkins`
- `GET /api/weekly-status`

도메인 핵심 규칙:
- 1일 1회 체크인
- 주간 목표 3회
- 주간 미달 시 벌금 KRW 10,000

## Notes

- `skills/` 디렉터리는 애플리케이션 사용자 문서가 아니라 내부 작업 스킬 문서입니다.
- 상세 설명은 README에 중복 작성하지 않고 `docs/`를 단일 상세 문서 경로로 사용합니다.
