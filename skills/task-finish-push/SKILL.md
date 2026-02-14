---
name: task-finish-push
description: 작업 브랜치에서 task 완료 시 commit과 push를 필수로 수행한다.
metadata:
  short-description: task 완료 커밋/푸시
---

# Task 완료 후 Push

에이전트가 task 완료를 선언할 때 사용한다.

## 필수 단계

1. 현재 브랜치와 작업 상태를 확인한다.
- `git branch --show-current`로 현재 브랜치를 확인한다.
- `git status --short`로 변경 파일을 확인한다.
- PM이 지정한 worktree 경로/브랜치와 현재 값이 일치하는지 확인한다.
- PM 할당의 worktree 경로/브랜치 값이 비어 있으면 작업을 중단하고 할당 보완을 요청한다.

2. 변경 범위를 점검한다.
- `git status --short`를 실행한다.
- 현재 task와 무관한 파일이 섞이지 않았는지 확인한다.

3. 커밋을 생성한다.
- `git add <task files>`를 우선 사용한다. (`git add .`는 안전할 때만 사용)
- `git commit -m "<type>(<scope>): <summary>"`를 실행한다.

4. 브랜치를 푸시한다.
- `git push origin <current-branch>`를 실행한다.

5. 완료 결과를 보고한다.
- 브랜치명, 커밋 해시, compare/PR URL을 함께 전달한다.

## MD 전용 빠른 경로

- 변경 파일이 `*.md`만인 경우 테스트를 생략하고 바로 commit/push한다.
- `git diff --name-only --cached` 또는 `git diff --name-only`로 파일 유형을 먼저 확인한다.
- 코드 파일이 1개라도 포함되면 일반 경로(테스트 포함)를 따른다.

## 가드레일

- 작업 브랜치에서 먼저 commit/push하는 흐름을 우선한다.
- 지정된 에이전트 worktree 외 경로에서 commit/push하지 않는다.
- 무관한 변경은 자동 커밋하지 않는다.
- 커밋 실패 시 실행 명령과 에러를 그대로 보고한다.
