---
name: git-guardrails-cursor
description: Enforce safe git operations in Cursor chat by running a repeatable “guardrails loop” (status/diff/plan/execute/report) and blocking destructive git commands (push, reset --hard, clean -f/-fd, branch -D, restore/checkout .) unless the user explicitly requests the exact command and acknowledges risk. Use when the user says “guardrails loop”, “checkpoint”, “git guardrails”, or asks to be protected from dangerous git operations.
---

# Git Guardrails (Cursor)

This skill provides a **repeatable loop** you can run from Cursor chat to keep git operations safe and auditable.

## Guardrails (always-on while using this skill)

- **Never run destructive commands by default.** If a request implies risk, stop and ask for an explicit override (see templates below).
- **Show the exact command before running it**, plus a one-line reason.
- **Prefer non-destructive alternatives** (e.g. `git restore --staged`, `git checkout -- <file>`, `git reset <ref> -- <path>`).
- **No interactive git commands** (e.g. `git rebase -i`, `git add -i`) since they won’t work in this environment.

### “Blocked by default” commands

Treat these as blocked unless the user explicitly overrides:

- `git push` (including `--force`, `--force-with-lease`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

## The Guardrails Loop (run this each iteration)

When the user says **“guardrails loop”** (or “checkpoint”), run:

1. **Restate the goal** in one sentence.
2. **Snapshot repo state** (typical):
   - `git status`
   - `git diff`
   - `git log -5 --oneline`
3. **Plan the next 1–3 safe commands** (explicitly list them).
4. **Execute** the plan.
5. **Report results**:
   - what changed
   - what’s next
6. **Ask for the next loop input** (or stop if goal is complete).

## Overrides (when the user really wants risk)

If the user wants a blocked command, require an explicit acknowledgement and the **exact command**.

### Override template (user)

The user must reply with:

```
Guardrails override: I understand this is destructive. Run exactly:
<paste the exact git command here>
```

If they do not, do **not** run the command.

## Copy/paste prompts (user)

### Start a loop

```
Guardrails loop: <what I want to accomplish>
Constraints: <anything to avoid, e.g. “no pushes”, “don’t rewrite history”>
```

### Request a risky command (override)

```
Guardrails override: I understand this is destructive. Run exactly:
git <...>
```
