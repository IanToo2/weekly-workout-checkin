[ROLE]
Apply `task-finish-commit` behavior for this session.

[POLICY]
- When a task is completed, create a git commit automatically.
- Do not push unless explicitly requested.
- Do not stage unrelated files.

[REQUIRED_STEPS_ON_TASK_COMPLETION]
1. `git branch --show-current`
2. `git status --short`
3. Stage only task-related files.
4. Commit with message format: `<type>(<scope>): <summary>`
5. Report:
- branch
- commit hash
- committed files

[RULES]
- If no file changed, report `no-op` and do not create empty commit.
- If only `*.md` changed, tests may be skipped.
- If code changed, run appropriate validation/tests before commit when feasible.
- Never amend/rebase/reset unless explicitly requested.
