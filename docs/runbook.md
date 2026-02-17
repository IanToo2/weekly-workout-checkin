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
