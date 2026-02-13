---
name: fitness-weekly-checkin
description: 고정 주간 규칙(하루 1회, 주 3회, 월~일, 벌금)에 맞춰 운동 인증 MVP를 빠르게 개발한다.
metadata:
  short-description: 운동 인증 MVP 개발 워크플로우
---

# 운동 주간 인증

불필요한 절차를 줄이고 이 토이프로젝트를 빠르게 개발/개선한다.

## 사용 시점

주간 운동 인증, 주간 달성/실패 판정, 1만원 벌금 로직과 관련된 작업일 때 사용한다.

## 고정 규칙

- 멤버별 하루 인증은 최대 1회만 허용한다.
- 주간 인증은 최소 3회가 목표다.
- 주간 범위는 월요일부터 일요일까지다.
- 주간 인증 횟수가 3회 미만이면 벌금 10,000원을 부과한다.

## 작업 순서

1. 계약을 먼저 고정한다.
- UI나 서비스 로직 수정 전에 API 요청/응답 필드를 먼저 확정한다.
- 규칙 상수는 백엔드 서비스에 중앙화한다.
- 개발 시작 전에 요청/응답 예시를 작업 노트에 남긴다.

2. 프론트 연동 전에 백엔드를 먼저 구현한다.
- JPA 엔티티와 저장소 제약조건을 추가/수정한다.
- 필요한 엔드포인트만 `/api` 아래에 노출한다.
- 동일 일자 중복 인증은 일관된 검증 에러로 반환한다.

3. 프론트는 실제 API와 연결한다.
- API 호출 코드는 `frontend/src/api.ts`에 유지한다.
- 첫 화면에서 규칙 요약과 주간 상태를 확인 가능하게 한다.

4. 핵심 경로를 검증한다.
- 헬스 체크는 `ok`를 반환해야 한다.
- 동일 날짜 중복 인증은 거부되어야 한다.
- 주간 상태는 월~일 범위와 벌금 금액을 정확히 반영해야 한다.

5. 실행에 필요한 정보만 문서화한다.
- 명령어나 환경값이 바뀌면 루트 `README.md` 실행 절차를 갱신한다.

6. 작업 완료 시 git publish까지 수행한다.
- 지정된 역할 브랜치에서만 작업한다.
- `git status --short`로 변경 파일을 확인한다.
- 커밋 메시지는 `feat|fix|chore(scope): summary` 형식을 사용한다.
- 브랜치를 푸시한다: `git push origin <role-branch>`.
- 결과 보고 시 커밋 해시와 PR URL(또는 PR 생성 명령)을 포함한다.

## 협업 모드 (Worktree)

- 기획 worktree: `worktrees/planner` / 브랜치 `role/planner`
- 백엔드 worktree: `worktrees/backend` / 브랜치 `role/backend`
- 프론트엔드 worktree: `worktrees/frontend` / 브랜치 `role/frontend`
- QA worktree: `worktrees/qa` / 브랜치 `role/qa`
- 머지 순서: `role/planner` -> `role/backend` -> `role/frontend` -> `role/qa` -> `main`

## 주요 수정 경로

- Backend: `backend/src/main/java/com/toyproject/fitness/checkin/`
- Backend config: `backend/src/main/resources/application.yml`
- Frontend app: `frontend/src/`
- Infra: `docker-compose.yml`

## 가드레일

- 요청이 없으면 과한 아키텍처나 추가 서비스를 도입하지 않는다.
- 작고 되돌리기 쉬운 변경을 우선하고, 이름은 명확하게 유지한다.
- 의존성은 최소화한다.
- 역할 worktree에서 `main`으로 직접 push하지 않는다.
