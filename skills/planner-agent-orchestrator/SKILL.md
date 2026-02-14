---
name: planner-agent-orchestrator
description: Define a reusable kickoff prompt spec for a PM/planner agent that delegates tasks to backend/frontend/qa/docs agents, controls dependencies and done criteria, and generates handoff outputs. Use when starting a new session and assigning cross-agent roles.
---

# PM Kickoff Prompt Spec

Use this skill when a session starts and you need to assign the PM/planner role with a stable, repeatable contract.

## Canonical template

Use this file as the single source:

- `skills/planner-agent-orchestrator/assets/pm-kickoff-prompt-template.md`
- `skills/planner-agent-orchestrator/assets/session-start-role-prompts.md`

Do not rewrite structure each session. Only replace placeholder values.

## Required input blocks

Before sending the kickoff prompt, fill these blocks:

- `PROJECT_RULES`
- `CURRENT_HANDOFF`
- `API_CONTRACT_STATUS`
- `CODE_ANCHORS`
- `AVAILABLE_AGENTS`
- `WORKTREE_ASSIGNMENT`

If `CURRENT_HANDOFF` is unavailable, set `CURRENT_HANDOFF: NONE` and add one risk item that context is incomplete.

## Worktree assignment spec

Declare one worktree path per agent in kickoff prompt.

Required format:

- `agent-name -> absolute-or-repo-relative-worktree-path`

Rules:

- One agent must map to one primary worktree path.
- Do not assign two agents to the same primary worktree for parallel editing.
- If an agent is `not used this sprint`, set mapping value to `NONE`.
- Any task report from an agent must include its assigned worktree path.

## Repository defaults

Use these defaults unless explicitly changed:

- Backend path: `backend/src/main/java/com/toyproject/fitness/checkin/`
- Frontend path: `frontend/src/`
- Key APIs: `GET /api/health`, `GET /api/rules`, `POST /api/checkins`, `GET /api/weekly-status`
- Product rules:
  - One check-in per day
  - Weekly target: 3 check-ins (Mon-Sun)
  - Weekly fine: KRW 10,000 if target is missed

## Output contract to enforce

The PM/planner response must always include:

- `Sprint Plan`
- `Agent Assignment` table
- `Agent Prompts` per assigned agent
- `Risks & Open Issues`
- `Handoff Message`

Reject outputs that omit dependency, deliverable, or done-definition at task level.

## Quality gate before use

Run this quick check before sending the kickoff prompt:

1. All placeholder tags are replaced, except intentionally set `NONE`.
2. Every agent has at least one clear deliverable or is explicitly marked `not used this sprint`.
3. At least one verification condition exists per Must task.
4. Any potential breaking API change is marked in the assignment table.

## Role set (current)

Current assignable roles in this repository:

1. `pm-planner-agent`
2. `backend-agent`
3. `frontend-agent`
4. `qa-agent`
5. `docs-agent`
6. `task-finish-commit-policy`
