---
name: task-finish-commit
description: Deprecated policy. Use `task-finish-push` instead when task completion must include validation, commit, and push.
---

# Task Finish Auto Commit (Deprecated)

Do not use this skill for new sessions.
Use `skills/task-finish-push/SKILL.md` as the default completion policy.

## Migration

If this skill is referenced, replace it with:

- `task-finish-push` workflow
- session prompt: `skills/task-finish-push/assets/session-start-finish-push-prompt.md`
