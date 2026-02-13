---
name: handoff-contract
description: 4개 에이전트(기획, 백엔드, 프론트엔드, QA) 간 인수인계를 표준 형식으로 고정한다.
metadata:
  short-description: 에이전트 인수인계 표준
---

# 인수인계 계약

에이전트가 작업을 넘길 때, 누락 없이 다음 담당자가 바로 실행할 수 있게 만든다.

## 사용 시점

- 한 에이전트가 task를 끝내고 다른 에이전트로 전달할 때
- 병렬 작업 중 의존 관계가 생겨 전달이 필요할 때

## 인수인계 템플릿

아래 형식을 그대로 채운다.

```md
[Handoff]
- from: <role/planner|role/backend|role/frontend|role/qa>
- to: <role/planner|role/backend|role/frontend|role/qa>
- task: <한 줄 설명>
- branch: <현재 브랜치>
- commit: <커밋 해시>
- files: <핵심 파일 목록>
- api-contract: <변경 없음 | 변경 있음(요약)>
- done-definition:
  - <완료 기준 1>
  - <완료 기준 2>
- blockers:
  - <없음 또는 이슈>
- next-actions:
  1. <다음 담당자가 바로 할 일 1>
  2. <다음 담당자가 바로 할 일 2>
```

## 필수 규칙

- 인수인계 전에 `git push origin <role-branch>`를 완료한다.
- `branch`, `commit`, `files` 3개 항목은 비우지 않는다.
- API 계약 변경이 있으면 `api-contract`에 필수로 기록한다.
- 차단 이슈가 있으면 재현 명령을 함께 남긴다.

## 가드레일

- 구두/자유형 전달만 하고 task를 종료하지 않는다.
- 로컬 변경만 있는 상태에서 인수인계하지 않는다.
- 다음 담당자의 역할 범위를 침범하지 않는다.
