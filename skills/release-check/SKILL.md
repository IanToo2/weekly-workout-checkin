---
name: release-check
description: Minimal pre-release checks for the weekly workout check-in MVP.
metadata:
  short-description: MVP release safety checks
---

# Release Check

Use this skill before demo or deploy.

## Required Checks

1. Rule integrity.
- One check-in per day is enforced.
- Weekly target is 3 (Monday to Sunday).
- Fine is KRW 10,000 when weekly count is below 3.

2. API sanity.
- `GET /api/health` returns `ok`.
- `POST /api/checkins` creates one record.
- Duplicate same-day check-in is rejected.
- `GET /api/weekly-status` returns expected pass/fail and fine.

3. UI sanity.
- First screen renders backend status.
- Rule summary is visible.
- API error message is visible when request fails.

4. Runbook sanity.
- Root `README.md` startup commands are current.

## Output Format

- Report only: Passed, Failed, and exact failing step.
- Keep notes short and actionable.

## Guardrails

- No refactor during release check unless requested.
- Prefer smallest possible fix for blockers.
