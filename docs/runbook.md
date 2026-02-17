# Runbook

이 문서는 PostgreSQL/Flyway 운영 기준과 장애 대응 절차를 정의한다.

## Ownership and Responsibility

| 영역 | Primary Owner | Backup | 책임 |
| --- | --- | --- | --- |
| DB 운영(PostgreSQL) | Platform/Infra Owner | 지정 Backup | 인스턴스 상태, 접속 정책, 백업/복구 |
| 마이그레이션(Flyway) | Platform/Infra Owner | 지정 Backup | 버전 배포 순서, 실패 대응, 승인 게이트 |
| API 계약 영향 검증 | FE Owner + BE Owner | 각 Backup | 마이그레이션으로 인한 계약/타입 영향 점검 |

## Flyway Execution Strategy

원칙:

- `stage`, `prod`는 CI에서만 Flyway를 실행한다.
- 애플리케이션 시작 시점 자동 마이그레이션은 운영 기준에서 제외한다.
- 배포 순서는 `Flyway 성공 -> Backend 배포 -> Smoke Test`를 강제한다.

권장 파이프라인 순서:

1. `flyway validate`
2. `flyway migrate`
3. Backend 배포
4. `GET /api/health` 확인
5. 핵심 API 스모크 테스트

실패 대응:

- `validate` 실패: 배포 중단, 누락/변경된 마이그레이션 파일 복구
- `migrate` 실패: 즉시 배포 중단, 롤포워드/복구 SQL 결정 후 재실행

## Environment Baseline

| Environment | DB 버전 | 실행 주체 | 변경 정책 | 비고 |
| --- | --- | --- | --- | --- |
| dev | PostgreSQL 16 | 개발자/CI | 파손 시 재구성 허용 | 로컬 재현 우선 |
| stage | PostgreSQL 16 | CI + Platform 승인 | 수동 DDL 금지 | prod 사전 검증 |
| prod | PostgreSQL 16 | CI + Platform 승인 | 수동 DDL 금지 | 변경 이력 추적 필수 |

충돌 방지 가이드:

- `stage`/`prod` DB에는 직접 SQL 콘솔 변경을 금지한다.
- 스키마 변경은 PR 기반 마이그레이션으로만 반영한다.
- 동일 버전 마이그레이션 수정 대신 신규 버전 추가를 사용한다.

## Quick Checks

1. DB 컨테이너 상태

```bash
docker ps
```

2. Backend 헬스체크

```bash
curl http://localhost:8080/api/health
```

3. 규칙 API 확인

```bash
curl http://localhost:8080/api/rules
```

## Common Symptoms and First Response

1. `/api/health` 실패
- Backend 미기동 또는 포트 충돌 확인
- 최근 배포/마이그레이션 실패 여부 확인

2. 배포 직후 DB 관련 예외 증가
- 마지막 Flyway 실행 로그 확인
- `stage`와 `prod` 적용 버전 일치 여부 확인

3. 데이터 정합성 이슈
- 수동 DDL 수행 여부 확인
- 배포 전후 API 계약 변경 이력(`docs/api.md`) 점검

## Rollback / Recovery Rules

- 앱 롤백과 DB 롤백은 분리해 판단한다.
- 파괴적 마이그레이션이 포함된 경우 앱만 롤백하지 않는다.
- 복구 전략은 PR에 사전 기록한다.
  - Roll-forward SQL
  - 백업 복구 절차
  - 서비스 영향 범위

## Postmortem Minimum

사후 기록은 최소 아래를 포함한다.

- Incident summary
- Timeline
- Root cause
- Customer impact
- Corrective actions (테스트/모니터링/가드레일 1개 이상)
