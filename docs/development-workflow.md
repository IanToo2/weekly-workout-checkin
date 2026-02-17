# Development Workflow

이 문서는 팀 공통 개발/리뷰/머지 절차를 정의한다.

## Branch Naming

- `feat/<topic>`: 기능 추가
- `fix/<topic>`: 버그 수정
- `chore/<topic>`: 유지보수/의존성/도구
- `docs/<topic>`: 문서 작업
- `hotfix/<topic>`: 긴급 수정

## Role Worktree Standard (MUST)

역할별 에이전트는 전용 worktree만 사용한다.

- Root worktree(사람 작업 기준): `/home/<user>/workspace/ToyProject/weekly-workout-checkin`
- Role worktree 경로 규칙: `/tmp/weekly-workout-checkin-<role>-owner`
- Role 브랜치 규칙: `role/<role>-owner`
- 생성 기준 브랜치: `origin/main`

표준 생성 예시:
```bash
git fetch origin
git worktree add /tmp/weekly-workout-checkin-frontend-owner -b role/frontend-owner origin/main
git worktree add /tmp/weekly-workout-checkin-backend-owner -b role/backend-owner origin/main
git worktree add /tmp/weekly-workout-checkin-infra-owner -b role/infra-owner origin/main
git worktree add /tmp/weekly-workout-checkin-pm-owner -b role/pm-owner origin/main
git worktree add /tmp/weekly-workout-checkin-qa-owner -b role/qa-owner origin/main
```

금지 사항:
- 전용 worktree가 아닌 경로에서 역할 작업 수행 금지
- Root worktree에서 에이전트 병렬 작업 금지
- 동일 파일 동시 수정 금지(사전 담당자 지정 필수)

작업 시작 체크(필수):
```bash
pwd
git branch --show-current
git status --short -- <role-scope-path>
git diff --name-only -- <role-scope-path>
```

작업 종료 체크(필수):
```bash
git status --short -- <role-scope-path>
git diff --name-only -- <role-scope-path>
```

역할별 `<role-scope-path>` 예시:
- FE: `frontend`
- BE: `backend`
- INFRA: `docker-compose.yml docs/setup.md docs/runbook.md`
- QA: `docs/runbook.md docs/changelog.md`
- PM: `docs`

PR 또는 작업 보고에는 시작/종료 체크 결과를 요약 포함한다.

## Commit Convention

커밋 메시지 형식:
```text
<type>(<scope>): <summary>
```

예시:
- `feat(api): add weekly status endpoint`
- `docs(readme): reorganize doc index`

## Pull Request Rules

PR 본문 필수 항목:
- Goal
- Scope
- Done Criteria
- Risks
- Validation Results
- Docs Sync 여부

## Review and Merge Gate

- 기본 승인: Code Owner 1명 이상
- API 계약/경계 변경: 관련 영역 Owner 2명 이상
- CI green + 필수 검증 통과 전 머지 금지

## Required Validation

1. Backend 변경:
```bash
cd backend
./mvnw test
```

2. Frontend 변경:
```bash
cd frontend
npm run build
```

3. API 계약 변경:
- Backend test + Frontend build 동시 수행
- `docs/api.md` 동기화

4. 문서-only 변경:
- 테스트 생략 가능
- 코드 기준 사실 검토 필수
