---
name: task-finish-report
description: 작업 완료 시 검증, 커밋, 푸시, 보고를 일관되게 수행하는 스킬. 마무리 누락을 줄이고 품질을 일정하게 유지할 때 사용한다.
---

# 작업 마무리 보고

작업 종료 시 아래 순서를 따른다.

1. 브랜치/변경 파일 확인
- `git branch --show-current`
- `git status --short`

2. 변경 성격에 맞는 검증 실행
- 코드 변경: 빌드/테스트 실행
- 문서만 변경: 테스트 생략 가능
- 이 저장소에서는 `project-validation-gate` 기준을 따른다.

3. 담당 영역 분리 확인
- 프론트엔드 담당은 `frontend/**` 중심으로만 변경
- 백엔드 담당은 `backend/**` 중심으로만 변경
- 영역 밖 변경이 있으면 이유를 보고에 명시

4. 작업 관련 파일만 스테이징/커밋
- 커밋 형식: `<type>(<scope>): <summary>`

5. Task 종료 push
- `git push origin <current-branch>`
- 검증 실패 상태에서는 push하지 않는다.

6. 최종 보고
- 브랜치, 커밋 해시, 검증 결과, push 결과, 잔여 이슈 포함
- API 계약 변경 시 README/API 문서 동기화 여부 포함

## 출력 형식

```md
## 작업 완료 보고
- 담당 영역:
- worktree/branch:
- 커밋:
- 변경 파일:
- 검증 실행/결과:
- push 결과:
- 영역 외 변경 여부:
- 잔여 이슈:
```
