# UI Revamp Service Definition

이 문서는 참여자 중심 UI 개편(Phase 1)의 기능 기준을 정의한다.

## Product Direction

- Primary user: 운동 참여자
- Primary flow: 오늘 체크인 빠른 완료
- Scope policy: MVP 기능 유지 + 확장 준비

## Service Capabilities (Phase 1)

### 1. App Bootstrap

목적:
- 앱 진입 시 서비스 상태/도메인 규칙을 로드해 현재 체크인 가능 상태를 판단한다.

필수 데이터:
- `GET /api/health`
- `GET /api/rules`

UX 결과:
- 로딩/성공/실패가 분리되어 표시된다.
- 실패 시 재시도 안내를 제공한다.

### 2. Home / Quick Check-in

목적:
- 참여자가 앱 진입 후 가장 짧은 동선으로 체크인을 완료한다.

필수 동작:
- `groupId`, `memberId`, `checkinDate` 입력/검증
- `POST /api/checkins` 호출
- 성공/실패 결과 즉시 피드백

필수 에러 처리:
- `DUPLICATE_CHECKIN`
- `GROUP_NOT_FOUND`
- `MEMBER_NOT_FOUND`
- `VALIDATION_ERROR`
- 비정상 응답 fallback

### 3. Weekly Report

목적:
- 이번 주 달성 상태와 남은 액션을 즉시 이해한다.

필수 동작:
- `GET /api/weekly-status`
- 기준일 기준 주간 집계 표시

필수 표시:
- `checkinCount`
- `requiredCount`
- `passed`
- `fineKrw`
- `weekStart` / `weekEnd`

### 4. Settings (Local Context)

목적:
- 반복 입력을 줄이기 위해 기본 `groupId/memberId`를 저장/복원한다.

저장 정책:
- `localStorage` 사용
- key: `wwc.groupId`, `wwc.memberId`

주의:
- 서버 인증/권한 모델이 아니라 로컬 편의 기능이다.

### 5. UI Error Experience Standard

원칙:
- `status`보다 `error.code`를 우선 사용한다.
- 코드가 없거나 알 수 없으면 공통 fallback 메시지를 사용한다.
- 기술 상세(스택트레이스/DB 메시지)를 사용자에게 직접 노출하지 않는다.

## Information Architecture Target

1. Home / Quick Check-in
- 오늘 체크인 CTA
- 체크인 결과
- 규칙 요약

2. Weekly Report
- 주간 진행률
- 남은 횟수
- 벌금 상태

3. Settings
- 기본 groupId/memberId
- 저장/초기화

## Out of Scope (Phase 1)

- 인증/권한/사용자 계정
- 그룹/멤버 관리 UI
- 히스토리 목록/통계 대시보드
- 신규 백엔드 엔드포인트 추가

## Delivery Ownership

- FE Owner: UI 구조/상태/에러 분기 구현
- BE Owner: FE 소비 계약 안정성 확인
- QA/Release Owner: 개편 회귀 검증 및 릴리스 체크리스트
- PM Owner: 기능 정의/문서 동기화 및 이슈 운영
