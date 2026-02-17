# AGENTS.md

이 문서는 `weekly-workout-checkin` 저장소에서 사람/에이전트가 동일한 기준으로 작업하기 위한 단일 운영 규약(SSOT)이다.

## 1. Team Topology

5인 시니어 팀 기준 역할 분리:
- FE Owner (Primary 1, Backup 1)
- BE Owner A (Primary)
- BE Owner B (Primary)
- Platform/Infra Owner (Primary)
- QA/Release Owner (Primary)

각 영역은 Primary와 Backup을 반드시 지정하고, 부재 시 Backup이 승인/대응을 대행한다.

## 2. Scope Boundaries

- `frontend/**`: UI, 화면 상태, API client, 타입
- `backend/**`: API, 도메인 로직, 영속성, 예외 처리
- `docker-compose.yml` 및 실행/배포 인프라: Platform/Infra Owner 승인 필수
- 경계 넘는 변경(예: API 계약 변경)은 FE+BE 양측 리뷰 필수

## 3. Start-of-Work Contract (MUST)

작업 시작 시 PR 본문 또는 작업 노트에 아래 4개를 먼저 작성한다.
- Goal
- Scope
- Done Criteria
- Risks

작업 범위 밖 변경이 필요하면 사유를 먼저 기록하고 리뷰어 동의를 받는다.

## 4. Source of Truth

- API 계약: `docs/api.md`
- 아키텍처/책임 경계: `docs/overview.md`
- 실행/운영: `docs/setup.md`, `docs/runbook.md`
- 기술 결정 기록: `docs/adr/*`

코드와 문서가 충돌하면 같은 PR에서 둘 다 수정한다.

## 5. PR Gate (MUST)

- 작은 PR 우선(권장 400 LOC 이하, 생성 파일 제외)
- 커밋 메시지 형식: `<type>(<scope>): <summary>`
- 머지 전 필수:
  - CI green
  - 필수 검증 통과
  - 코드 오너 승인 1+
  - 경계/계약 변경 시 관련 오너 승인 2+

## 6. Validation Gate (MUST)

변경 유형별 필수 검증:

1. Backend 변경 (`backend/src/main/**`)
```bash
cd backend
./mvnw test
```

2. Frontend 변경 (`frontend/src/**`, `frontend/vite.config.ts`)
```bash
cd frontend
npm run build
```

3. API 계약 변경 (엔드포인트/필드/에러코드)
- Backend 테스트 + Frontend 빌드 모두 실행
- `docs/api.md` 동시 업데이트 필수

4. 문서-only 변경 (`*.md`만 수정)
- 테스트 생략 가능
- 단, 문서가 실제 코드와 일치하는지 검토 필수

## 7. API Contract Sync (MUST)

아래 변경은 "API 계약 변경"으로 간주한다.
- Controller 경로/메서드/파라미터 변경
- 응답 JSON 필드 추가/삭제/타입 변경
- 오류 코드(`code`) 또는 메시지 정책 변경

위 변경 시 반드시:
- `docs/api.md` 업데이트
- FE 타입/호출 코드 영향 확인
- PR 설명에 호환성 영향 명시

## 8. ADR Policy (MUST)

아래 항목은 ADR 작성 대상이다.
- 데이터 모델/영속화 전략 변경
- 도메인 규칙 변경 (예: 주간 기준, 벌금 계산)
- 외부 의존성/인프라 전략 변경
- 예외 처리 표준 변경

ADR은 `docs/adr/NNNN-title.md` 형식을 따른다.

## 9. Incident and Hotfix

- 긴급 수정 브랜치: `hotfix/*`
- 핫픽스 머지 후 24시간 내 `docs/runbook.md` 또는 ADR에 사후 기록
- 재발 방지 액션(테스트/모니터링/가드레일) 최소 1개 이상 등록

## 10. Forbidden Actions

- 무관한 파일 대량 포맷팅/리네임 금지
- 파괴적 Git 명령(`git reset --hard`, 강제 push) 금지
- 근거 없는 스키마/계약 변경 금지
- 검증 실패 상태 커밋/머지 금지

## 11. Definition of Done

아래를 모두 만족해야 완료로 본다.
- 코드 변경 의도가 Goal/Scope와 일치
- 필수 검증 통과
- 관련 문서 동기화 완료
- 롤백/리스크가 PR에 명시
- 담당 오너 승인 완료

## 12. Worktree Discipline (MUST)

- 역할 작업은 전용 worktree에서만 수행:
  - 경로 규칙: `/tmp/weekly-workout-checkin-<role>-owner`
  - 브랜치 규칙: `role/<role>-owner` (`origin/main` 기반)
- 루트 worktree(`/home/<user>/workspace/ToyProject/weekly-workout-checkin`)에서 역할 에이전트 병렬 작업 금지
- 작업 시작 시 아래를 확인하고 작업 노트/PR에 요약:
  - `pwd`
  - `git branch --show-current`
  - `git status --short -- <role-scope-path>`
  - `git diff --name-only -- <role-scope-path>`
- `<role-scope-path>` 기본값:
  - FE: `frontend`
  - BE: `backend`
  - INFRA: `docker-compose.yml docs/setup.md docs/runbook.md`
  - QA: `docs/runbook.md docs/changelog.md`
  - PM: `docs`
