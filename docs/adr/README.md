# ADR Guide

ADR(Architecture Decision Record)은 중요한 기술/운영 결정을 기록하는 문서다.

## When to Write ADR

아래 항목 변경 시 ADR 작성:
- 도메인 규칙 변경
- 영속화/데이터 모델 전략 변경
- 에러 처리/계약 호환성 정책 변경
- 인프라/의존성 전략 변경

## File Naming

형식:
```text
NNNN-title.md
```

예시:
- `0001-weekly-rule-baseline.md`
- `0002-api-error-format.md`

## ADR Template

```md
# ADR NNNN: Title

## Status
proposed | accepted | superseded

## Context
문제 배경과 제약

## Decision
채택한 결정

## Consequences
장점/단점/리스크

## Alternatives Considered
대안과 기각 이유
```

## Lifecycle

- `proposed`로 시작
- 합의 후 `accepted`로 변경
- 대체 결정이 생기면 `superseded` 처리
