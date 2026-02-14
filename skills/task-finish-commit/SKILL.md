---
name: task-finish-commit
description: Automatically create a git commit when a task is finished on a working branch. Use when the user wants task completion to include commit by default, while keeping push optional unless explicitly requested.
---

# Task Finish Auto Commit

Use this skill when task completion should automatically include a commit.

## Default policy

- Commit is required at task completion.
- Push is optional and must be explicitly requested.
- Do not include unrelated files in the commit.

## Required workflow

1. Check branch and working tree.
- Run `git branch --show-current`.
- Run `git status --short`.

2. Validate commit scope.
- Confirm changed files belong to the finished task.
- Exclude unrelated files from staging.

3. Stage task files.
- Prefer `git add <task files>`.
- Use `git add .` only when all modified files are in scope.

4. Create commit.
- Message format: `<type>(<scope>): <summary>`.
- Recommended `type`: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.

5. Report result.
- Include branch name, commit hash, and committed file list.
- If there are no changes, report `no-op` clearly.

## Optional push mode

Only if user asks:

- Run `git push origin <current-branch>`.
- Report push result with remote branch.

## Fast path for docs-only changes

- If changed files are only `*.md`, skip tests and commit directly.
- If any code file is included, follow normal validation flow before commit.

## Guardrails

- Do not auto-commit unrelated changes.
- Do not amend commits unless explicitly requested.
- If commit fails, report exact command and error output.
- Do not run destructive git commands.
