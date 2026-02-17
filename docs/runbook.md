# Runbook

이 문서는 운영/개발 환경에서 자주 발생하는 이슈의 1차 대응 절차를 제공한다.

## Incident Response Flow

1. 증상 수집
- 사용자 영향 범위 확인
- 발생 시각/재현 조건 기록

2. 기본 상태 확인
- DB/Backend/Frontend 프로세스 상태 확인
- 최근 변경(PR/커밋) 확인

3. 원인 분류
- 인프라(포트, DB, 네트워크)
- 애플리케이션(예외, 계약 불일치)
- 데이터(중복/누락)

4. 임시 완화 또는 롤백
- 서비스 영향 최소화 우선

5. 사후 기록
- 원인/조치/재발방지 항목 문서화

## Quick Checks

1. DB 확인
```bash
docker ps
```

2. Backend health 확인
```bash
curl http://localhost:8080/api/health
```

3. Rules API 확인
```bash
curl http://localhost:8080/api/rules
```

## UI Revamp Regression Checklist

UI 개편 릴리스 전, 아래 체크리스트를 순서대로 검증한다.

### Preconditions

- Backend `http://localhost:8080` 정상 기동 (`/api/health` 응답 확인)
- Frontend 최신 빌드 성공 (`cd frontend && npm run build`)
- 검증 기준 날짜를 기록 (예: `2026-02-17`)

### Scenario Checklist

1. 오늘 체크인 성공
- 입력: 유효한 `groupId`, `memberId`, `checkinDate=today`
- 기대 결과: 성공 메시지 표시, 등록된 `id/groupId/memberId/checkinDate` 확인

2. 오늘 체크인 실패 - 중복
- 입력: 같은 `groupId/memberId/checkinDate`로 재요청
- 기대 결과: `DUPLICATE_CHECKIN` 또는 중복 안내 메시지 표시

3. 오늘 체크인 실패 - 잘못된 ID
- 입력: 비정상 ID(빈 값, 문자열, 파라미터 누락 또는 타입 오류)
- 기대 결과: `VALIDATION_ERROR` 또는 입력 오류 메시지 표시

4. 주간 리포트 조회 성공
- 입력: 유효한 `groupId/memberId` (+ 필요 시 `date`)
- 기대 결과: `weekStart/weekEnd/checkinCount/requiredCount/passed/fineKrw` 정상 렌더링

5. 주간 리포트 조회 실패
- 입력: 잘못된 query 파라미터(누락/타입 오류)
- 기대 결과: `VALIDATION_ERROR` 또는 조회 실패 메시지 표시

6. 설정 저장 후 재접속 복원
- 입력: 사용자 설정 변경 후 저장, 페이지 새로고침/재접속
- 기대 결과: 저장한 설정이 복원됨 (예: localStorage 기반 persistence)

### Evidence Template (Issue Comment)

- Scenario:
- Steps to Reproduce:
- Expected:
- Actual:
- Evidence: 로그/스크린샷/명령 출력
- Result: PASS / FAIL / BLOCKED

## Common Symptoms

1. `/api/health` 실패
- Backend 미기동 또는 포트 충돌 가능
- `backend` 실행 로그 확인

2. `VALIDATION_ERROR` 증가
- FE 요청 파라미터/바디 변경 여부 확인
- 최근 API 계약 변경 여부 확인

3. `DUPLICATE_CHECKIN` 다수 발생
- 사용자 입력/UX 흐름 점검
- 중복 제출 방지 UI/재시도 로직 확인

4. Backend 기동 실패 - `Unsupported Database` (Flyway)
- 증상 예시:
  - `Unsupported Database: PostgreSQL 15.x/16.x`
- 원인:
  - Flyway DB 지원 모듈/버전과 실행 DB 버전 불일치
- 즉시 조치:
  - 운영/스테이지: Flyway 지원 버전으로 DB 정합성 확인 후 배포 중단
  - QA 임시 검증: `SPRING_FLYWAY_ENABLED=false`로 앱 기동 (운영 적용 금지)
- 재발 방지:
  - `flyway-core`와 PostgreSQL 지원 버전 매트릭스 점검을 PR 체크리스트에 추가
  - CI에서 Flyway migrate 스모크를 DB 타깃 버전별로 1회 이상 수행

5. Backend 기동 실패 - `Schema-validation: missing table [checkins]`
- 증상 예시:
  - `ddl-auto: validate` 상태에서 테이블 검증 실패
- 원인:
  - Flyway 미적용 상태에서 스키마가 생성되지 않음
- 즉시 조치(QA 임시):
```bash
cat backend/src/main/resources/db/migration/V1__init.sql \
  | docker exec -i <postgres-container> psql -U toyuser -d toyproject
```
- 재발 방지:
  - `validate` 모드 환경에서는 마이그레이션 선행 여부를 배포 게이트로 강제

6. Frontend build 실패 (`@rollup/*` optional dependency)
- 증상 예시:
  - `Cannot find module @rollup/rollup-linux-x64-gnu`
  - `npm has a bug related to optional dependencies`
- 1차 복구:
```bash
cd frontend
rm -rf node_modules
npm ci
npm run build
```
- 재발 방지:
  - `package-lock.json` 유지
  - 로컬/CI 기본 설치를 `npm ci`로 통일

## Rollback Rules

- 핫픽스 전 릴리스 기준으로 즉시 되돌릴 수 있는 절차를 PR에 명시
- 롤백 시 데이터 영향(이미 저장된 체크인 데이터) 여부를 별도로 기록

## Postmortem Minimum

사후 문서에는 최소 아래를 포함한다.
- Incident summary
- Timeline
- Root cause
- Customer impact
- Corrective actions
