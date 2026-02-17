# FE Error Code Readiness (Pre-Work)

## Goal
- BE 에러코드 정규화 확정 전에 FE 영향도를 선점검하고, 확정 즉시 반영 가능한 변경 포인트를 명확히 한다.

## Scope
- `frontend/src/api.ts` 에러 파싱/예외 모델 점검
- `frontend/src/App.tsx` 체크인 실패 분기 점검
- 코드 선변경 없이 적용 계획만 문서화

## Done Criteria
- BE 에러코드 확정 시 FE 반영 파일과 로직이 식별된다.
- 확정 전에는 불필요한 FE 코드 선작업이 없다.

## Risks
- BE 최종 에러코드 세트/의미가 변경되면 메시지 매핑 표를 수정해야 한다.
- 비표준 에러 응답(HTML, 빈 바디 등) 발생 시 `fallback` 메시지 설계가 필요하다.

## Current FE Findings

### 1) 공통 API 에러 처리 (`frontend/src/api.ts`)
- 실패 응답은 `{ code, message }`를 `ApiRequestError(status, message, code)`로 변환한다.
- `code`는 저장되지만 호출부에서 적극적으로 활용되지 않는다.

### 2) 체크인 등록 실패 분기 (`frontend/src/App.tsx`)
- `handleCheckinSubmit`는 `ApiRequestError`에서 `status === 409`만 특수 처리한다.
- 그 외는 `error.message` 문자열을 그대로 노출한다.
- 결과적으로 신규/변경 에러코드 추가 시 화면 분기는 사실상 확장되지 않은 상태다.

### 3) 주간 상태 조회 실패 분기 (`frontend/src/App.tsx`)
- `getWeeklyStatus` 실패는 코드 분기 없이 일반 메시지 표시만 수행한다.

## FE 대응 제안 (BE 에러코드 확정 후 즉시 적용)

### A. 코드 중심 분기로 전환
- `status` 중심(`409`) 분기 대신 `error.code` 중심 분기를 기본으로 사용한다.
- 예시 구조:
  - `DUPLICATE_CHECKIN`: 사용자 행동 유도 메시지
  - `VALIDATION_ERROR`: 입력값 점검 메시지
  - 정의되지 않은 코드: 공통 fallback 메시지

### B. 타입 강화
- `frontend/src/types.ts`에 FE가 인지하는 에러코드 유니온 타입을 도입한다.
- BE 확정 전까지는 초안만 유지하고, 확정 시 최종 코드셋으로 고정한다.

### C. 메시지 매핑 단일화
- 화면 컴포넌트 내부 하드코딩 대신 공통 변환 함수로 메시지 매핑을 집중시킨다.
- 목적: 체크인/주간조회/향후 엔드포인트에서 동일 정책 적용.

## Proposed Change Points (After BE Confirmation)
- `frontend/src/types.ts`: FE 에러코드 타입 추가/갱신
- `frontend/src/api.ts`: 에러 payload 가드 보강(비표준 응답 fallback 포함)
- `frontend/src/App.tsx`: `status===409` 분기 제거, `code` 기반 분기 적용

## Applied Status (After BE PR #17 Merge)
- BE PR #17 merged (`2026-02-17`) 후 FE 최소 수정 반영을 시작했다.
- 반영 범위:
  - `frontend/src/types.ts`: FE 에러코드 타입(`ApiErrorCode`) 추가
  - `frontend/src/api.ts`: 에러 payload 가드 보강
  - `frontend/src/App.tsx`: `status===409` 의존 분기 제거, `code` 중심 분기 적용
