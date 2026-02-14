---
name: project-validation-gate
description: 이 저장소에서 변경 유형별 필수 검증을 적용하는 스킬. 백엔드/프론트/API 계약 변경 후 무엇을 검증할지 명확히 해야 할 때 사용한다.
---

# 프로젝트 검증 게이트

이 프로젝트(`weekly-workout-checkin`)에서는 변경 유형에 따라 아래 검증을 필수로 수행한다.

## 1) 백엔드 코드 변경

대상 예시:
- `backend/src/main/java/**`
- `backend/src/main/resources/**`

필수 검증:
1. `cd backend`
2. `.\mvnw.cmd test`

추가 확인:
- API 응답/에러 포맷 변경 시 프론트 타입과 일치 여부 확인

## 2) 프론트 코드 변경

대상 예시:
- `frontend/src/**`
- `frontend/vite.config.ts`

필수 검증:
1. `cd frontend`
2. `npm run build`

추가 확인:
- `ApiRequestError` 처리 분기(성공/실패/로딩)가 깨지지 않았는지 확인

## 3) API 계약 변경 (엔드포인트/필드/타입/에러코드)

대상 예시:
- `CheckinController`, `ApiExceptionHandler`, `frontend/src/types.ts`, `frontend/src/api.ts`

필수 검증:
1. 백엔드 테스트 실행
2. 프론트 빌드 실행
3. README API 목록 동기화 여부 확인

## 4) 변경 없음/문서만 변경

대상 예시:
- `*.md`만 수정

검증 정책:
- 테스트 생략 가능
- 문서가 실제 코드 상태와 일치하는지 확인

## 출력 형식

```md
## 검증 결과
- 변경 유형:
- 실행 명령:
- 결과:
- 생략 근거(있을 때):
- 남은 리스크:
```
