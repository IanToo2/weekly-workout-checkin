[ROLE]
Apply `task-finish-push` behavior for this session.

[POLICY]
- When a task is completed, run validation/build checks, then commit and push.
- Do not stage unrelated files.
- Do not skip push unless explicitly blocked by environment or user instruction.

[REQUIRED_STEPS_ON_TASK_COMPLETION]
1. `git branch --show-current`
2. `git status --short`
3. Verify current worktree path and branch match PM assignment.
4. Run build/test validation appropriate to changed files.
5. Stage only task-related files.
6. Commit with message format: `<type>(<scope>): <summary>`
7. `git push origin <current-branch>`
8. Report:
- branch
- commit hash
- committed files
- verification run
- push result
- worktree used

[RULES]
- If no file changed, report `no-op` and do not create empty commit.
- If only `*.md` changed, tests may be skipped.
- If code changed, validation is required before commit/push when feasible.
- If assigned worktree path or branch is missing, stop and request assignment first.
- If assigned worktree/branch mismatch is found, stop and report mismatch first.
- Never amend/rebase/reset unless explicitly requested.
