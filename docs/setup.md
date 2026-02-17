# Setup

이 문서는 로컬 개발 환경 준비, 실행 순서, 기본 트러블슈팅을 다룬다.

## Prerequisites

- Java 17
- Node.js 18+
- npm 9+
- Docker / Docker Compose

## Run Order

1. PostgreSQL 시작
```bash
docker compose up -d
```

2. Backend 시작 (`localhost:8080`)
```bash
cd backend
./mvnw spring-boot:run
```
Windows:
```bash
cd backend
.\\mvnw.cmd spring-boot:run
```

3. Frontend 시작 (`localhost:5173` 기본)
```bash
cd frontend
npm install
npm run dev
```

## Basic Health Check

- Backend health:
```bash
curl http://localhost:8080/api/health
```

- Rules API:
```bash
curl http://localhost:8080/api/rules
```

## Stop / Cleanup

- Frontend/Backend: 실행 터미널에서 `Ctrl+C`
- PostgreSQL:
```bash
docker compose down
```
데이터까지 제거하려면:
```bash
docker compose down -v
```

## Troubleshooting

1. DB 접속 실패
- `docker ps`로 `toyproject-postgres` 실행 여부 확인
- `backend/src/main/resources/application.yml`의 접속 정보 확인

2. 포트 충돌
- `5432`, `8080`, `5173` 사용 중 프로세스 확인 후 종료 또는 포트 변경

3. Frontend에서 API 오류
- Backend가 먼저 실행 중인지 확인
- 브라우저 네트워크 탭에서 `/api/*` 요청/응답 확인

4. Maven Wrapper 실행 오류
- 실행 권한 확인: `chmod +x backend/mvnw`
