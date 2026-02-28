---
name: one-task-loop
description: Execute a single iteration loop from Cursor chat: read PRD.md and progress.txt, find the next incomplete task, implement only that task, commit changes, and update progress.txt. Use when the user says “one task loop”, “next task”, “PRD loop”, or provides @PRD.md @progress.txt and asks to do one task at a time.
---

# One Task Loop (Cursor)

Cursor-friendly equivalent of:
`claude --permission-mode acceptEdits "@PRD.md @progress.txt ... ONLY DO ONE TASK AT A TIME."`

## How to invoke (user copy/paste)

```text
One task loop: @PRD.md @progress.txt
Rules:
- ONLY do ONE task
- Commit your changes
- Update progress.txt with what you did
```

## Loop steps (run exactly once per request)

1. **Read** `PRD.md` and `progress.txt`.
2. **Identify the next incomplete task** (the earliest task not marked done / not described as complete).
3. **Implement only that task**.
   - Keep scope tight; do not start the next task.
   - If implementing reveals missing prerequisite work, do the minimum prerequisite needed for _this_ task only.
4. **Verify quickly** (run the smallest reasonable check: typecheck/tests/lint for touched area, if available).
5. **Commit changes**.
   - Before commiting any code ask human for confirmation to do so
   - Follow repo’s commit conventions if evident from `git log`.
   - Commit message should describe the completed task outcome.
6. **Update `progress.txt`**:
   - Mark the task complete
   - Add 2–5 bullets: what changed, files touched (high level), and any follow-up notes
7. **Stop** and report:
   - task completed
   - commit hash
   - what the next task is (but do not start it)

## Guardrails

- Do not do multiple tasks “because it’s easy”.
- Do not refactor unrelated code.
- Do not add new dependencies unless the task requires it.
