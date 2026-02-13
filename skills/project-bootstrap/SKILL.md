---
name: project-bootstrap
description: 이 토이프로젝트(React+TS, Spring, PostgreSQL)를 빠르게 로컬 실행 상태로 만든다.
metadata:
  short-description: 로컬 실행 부트스트랩
---

# 프로젝트 부트스트랩

개발 시작 전 또는 신규 참여자 온보딩 시 사용한다.

## 단계

1. 데이터베이스를 시작한다.
- 저장소 루트에서 `docker compose up -d`를 실행한다.

2. 백엔드를 시작한다.
- `cd backend` 후 `mvn spring-boot:run`을 실행한다.
- `GET /api/health`가 `{"status":"ok"}`를 반환하는지 확인한다.

3. 프론트를 시작한다.
- `cd frontend` 후 `npm install`, `npm run dev`를 실행한다.
- 앱이 로드되고 `/api/rules`를 읽는지 확인한다.

4. git 협업 구성을 확인한다.
- `git worktree list`에서 planner/backend/frontend/qa worktree를 확인한다.
- `git branch --list`에서 `role/planner`, `role/backend`, `role/frontend`, `role/qa`를 확인한다.

5. push 준비 상태를 확인한다.
- 역할 브랜치는 최초 1회 `git push -u origin role/<name>`으로 upstream을 설정한다.
- 새 작업 시작 전 `git status --short`가 clean인지 확인한다.

## Worktree 경로

- Planner: `worktrees/planner`
- Backend: `worktrees/backend`
- Frontend: `worktrees/frontend`
- QA: `worktrees/qa`

## 빠른 점검

- Backend port: `8080`
- Frontend port: `5173`
- PostgreSQL port: `5432`

## 가드레일

- 요청이 없으면 인프라를 추가하지 않는다.
- 실행 실패 시 먼저 정확한 명령어와 에러를 기록한다.
- 역할 작업을 `main`에서 commit/push하지 않는다.
