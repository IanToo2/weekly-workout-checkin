---
name: api-contract-lock
description: 프론트엔드와 백엔드 병렬 개발을 위해 API 계약 변경을 통제하고 충돌을 줄인다.
metadata:
  short-description: API 계약 고정 및 변경 통제
---

# API 계약 고정

백엔드/프론트엔드 병렬 작업에서 계약 불일치로 인한 재작업을 방지한다.

## 사용 시점

- 새 API를 추가할 때
- 요청/응답 필드, 타입, 상태코드, 에러 포맷을 변경할 때

## 계약 체크리스트

1. 변경 전 계약을 먼저 문서화한다.
- 엔드포인트, 메서드, 요청 JSON, 응답 JSON, 상태코드, 에러코드

2. 변경 유형을 분류한다.
- `non-breaking`: 필드 추가, 선택값 추가
- `breaking`: 필드 삭제/이름 변경, 타입 변경, 필수값 추가, 상태코드 의미 변경

3. breaking 변경 처리 규칙을 따른다.
- 가능하면 새 엔드포인트 또는 버전 필드로 우회한다.
- 즉시 교체가 필요하면 프론트/백엔드 동시 PR로 처리한다.

4. 구현 후 계약 검증을 수행한다.
- 백엔드: 실제 응답이 계약과 일치하는지 확인
- 프론트: 파싱/표시/에러 처리 경로 확인

## 결과 보고 형식

```md
[API Contract]
- endpoint: <METHOD /api/...>
- change-type: <non-breaking|breaking>
- request-change: <없음|요약>
- response-change: <없음|요약>
- status-code-change: <없음|요약>
- frontend-impact: <없음|수정 필요(요약)>
- backend-impact: <없음|수정 필요(요약)>
- migration-note: <없음|요약>
```

## 가드레일

- 계약 기록 없이 API를 먼저 수정하지 않는다.
- breaking 변경을 단일 측(프론트 또는 백엔드)만 수정하고 merge하지 않는다.
- QA 전달 시 변경된 계약 항목을 누락하지 않는다.
