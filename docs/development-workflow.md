# Development Workflow

이 문서는 팀 공통 개발/리뷰/머지 절차를 정의한다.

## Branch Naming

- `feat/<topic>`: 기능 추가
- `fix/<topic>`: 버그 수정
- `chore/<topic>`: 유지보수/의존성/도구
- `docs/<topic>`: 문서 작업
- `hotfix/<topic>`: 긴급 수정

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
- PR 대상 자동 게이트: GitHub Actions `PR Quality Gate`
  - Backend Test (Maven): `cd backend && ./mvnw test`
  - Frontend Build (Node): `cd frontend && npm ci && npm run build`
  - 두 잡 중 하나라도 실패하면 PR 체크 실패

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
