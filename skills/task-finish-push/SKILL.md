---
name: task-finish-push
description: Finish a role task with required git commit and push on the assigned branch.
metadata:
  short-description: Commit and push task output
---

# Task Finish Push

Use this skill when an agent says a task is complete.

## Required Steps

1. Confirm branch and worktree.
- Planner: `role/planner` in `worktrees/planner`
- Backend: `role/backend` in `worktrees/backend`
- Frontend: `role/frontend` in `worktrees/frontend`
- QA: `role/qa` in `worktrees/qa`

2. Review staged scope.
- Run `git status --short`.
- Ensure only task-related files are included.

3. Commit task result.
- Run `git add <task files>` (or `git add .` only when safe).
- Run `git commit -m "<type>(<scope>): <summary>"`.

4. Push branch.
- Run `git push origin <role-branch>`.

5. Report completion.
- Output branch, commit hash, and compare/PR URL.

## Guardrails

- Never push directly to `main`.
- If unrelated changes exist, do not auto-commit them.
- If commit fails, report exact command and error.
