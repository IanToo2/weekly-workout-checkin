# Setup

이 문서는 WSL 표준 개발환경, EOL 정책, 로컬 실행 절차를 정의한다.

## Standard Baseline (WSL)

- OS: WSL2 + Ubuntu 22.04 LTS 이상
- Git: 2.40+
- Docker Desktop: WSL integration 활성화
- Shell: `bash` 또는 `zsh`
- Java 17
- Node.js 20 LTS (`frontend/.nvmrc` 기준)
- npm 10+
- Docker / Docker Compose

권장 Git 설정(WSL):

```bash
git config --global core.autocrlf input
git config --global core.eol lf
```

## Runtime Version Matrix

| Component | Version (Standard) | Notes |
| --- | --- | --- |
| Java | 17 (Temurin 권장) | Backend 빌드/실행 |
| Maven | Wrapper 사용 (`./mvnw`) | 로컬 Maven 별도 설치 불필요 |
| Node.js | 20 LTS | Frontend 빌드/실행 |
| npm | 10.x | Node 20 기본 포함 |
| Docker Engine | 24+ | 컨테이너 실행 |
| Docker Compose | v2.20+ | `docker compose` 명령 사용 |
| PostgreSQL | 16 | 로컬/운영 기준 버전 |

버전 확인:

```bash
cd backend && ./mvnw -v
node -v
npm -v
docker --version
docker compose version
```

## EOL Policy

저장소 루트 `.gitattributes` 기준:

- 기본 텍스트 파일: LF
- `*.sh`, `mvnw`: LF 강제
- `*.bat`, `*.cmd`, `*.ps1`: CRLF

정책 변경 시 문서(`docs/setup.md`, `docs/runbook.md`)와 함께 같은 PR에서 반영한다.

## Fresh Clone Procedure

1. 저장소 클론

```bash
git clone https://github.com/IanToo2/weekly-workout-checkin.git
cd weekly-workout-checkin
```

2. PostgreSQL 시작

```bash
docker compose up -d
```

3. Backend 검증/실행

```bash
cd backend
./mvnw test
./mvnw spring-boot:run
```

4. Frontend 검증/실행 (새 터미널)

```bash
cd frontend
npm ci
npm run build
npm run dev
```

Node 버전 고정(권장):
```bash
cd frontend
nvm use
```

## Frontend Build Validation (WSL)

아래 순서를 그대로 수행한다.
```bash
node -v
npm -v
cd frontend
npm ci
npm run build
npm run build
```

기대 결과:
- `npm ci` 성공
- `npm run build` 2회 연속 성공

## Flyway Operational Baseline (dev/stage/prod)

원칙:

- 마이그레이션 실행 주체는 CI/CD 파이프라인이다.
- 애플리케이션 시작 시 자동 마이그레이션을 운영 경로로 사용하지 않는다.
- 환경별 DB 상태 변경 책임은 Platform/Infra Owner가 가진다.

환경별 기준:

| Environment | DB 목적 | Flyway 실행 주체 | 앱 기동 책임 | 정책 |
| --- | --- | --- | --- | --- |
| dev | 개발/재현 | 개발자 로컬 또는 CI(브랜치 검증) | FE/BE Owner | 스키마 충돌 시 재생성 허용 |
| stage | 릴리스 검증 | CI 파이프라인 | Platform/Infra Owner | 프로덕션과 동일 순서로 migration 적용 |
| prod | 운영 | CI 파이프라인(수동 승인 단계 포함) | Platform/Infra Owner | 앱 배포 전 migration 선적용 필수 |

충돌 방지 규칙:

- 동일 버전의 마이그레이션 파일은 재작성하지 않는다.
- 환경 간 수동 DDL 실행을 금지하고, SQL 변경은 마이그레이션으로만 반영한다.
- 장애 시 되돌림 전략(roll-forward 또는 복구 SQL)을 PR에 명시한다.

## Basic Health Check

```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/rules
```

## Stop / Cleanup

- Frontend/Backend: 실행 터미널에서 `Ctrl+C`
- PostgreSQL 중지:

```bash
docker compose down
```

데이터까지 제거:

```bash
docker compose down -v
```

## Troubleshooting

1. DB 접속 실패
- `docker ps`로 `toyproject-postgres` 실행 여부 확인
- `backend/src/main/resources/application.yml` 접속 정보 확인

2. 포트 충돌
- `5432`, `8080`, `5173` 사용 프로세스 종료 또는 포트 재설정

3. Frontend API 오류
- Backend 먼저 실행 확인
- 브라우저 네트워크 탭에서 `/api/*` 요청/응답 확인

4. Maven Wrapper 실행 오류
- 실행 권한 확인: `chmod +x backend/mvnw`

5. WSL에서 `@rollup/*` optional dependency 오류
- 증상 예시:
  - `Cannot find module @rollup/rollup-linux-x64-gnu`
  - `npm has a bug related to optional dependencies`
- 조치 순서:
```bash
cd frontend
rm -rf node_modules
npm ci
npm run build
```
- 재발 방지:
  - `package-lock.json`을 항상 커밋하고, 기본 설치는 `npm ci`를 사용
  - lockfile 갱신이 필요한 변경(의존성 추가/버전 변경)에서만 `npm install` 사용
