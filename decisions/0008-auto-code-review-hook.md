# 0008. Automatic code review on file change (hook + subagent)

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 1 (tooling)

## Context
We want every changed source file reviewed automatically, by a reviewer that lives in this repo, without slowing down editing.

## Decision
- **Reviewer:** `.claude/agents/code-reviewer.md`. Read-only tools (Read, Grep, Glob), Sonnet, a repo-specific checklist and a fixed severity-ranked output format.
- **Triggers** (`.claude/settings.json`):
  - `PostToolUse` on `Write|Edit|MultiEdit` covers Claude's edits.
  - `FileChanged` covers edits made outside Claude. `SessionStart` (`watch-paths.mjs`) registers the repo's source files as watch paths, because FileChanged only fires for watched files.
- **Runner:** `review-hook.mjs` filters to source files and starts `review-worker.mjs` detached, then returns immediately. The worker runs `claude -p --agent code-reviewer --permission-mode dontAsk` and writes `.claude/reviews/<path>.md`.
- **Feedback loop:** on the next hook event, finished reviews whose verdict isn't ✅ are injected once into Claude's context (`additionalContext`).
- **Guards:**
  - A content hash skips re-reviewing unchanged content.
  - Only one worker runs per file, and it re-reviews (up to 3 passes) if the file changed mid-review.
  - The `PORTFOLIO_REVIEWER_CHILD` env var stops the reviewer's own session from starting more reviews.
  - The hook always exits 0.

## Alternatives considered
- `type: "agent"` hook: runs a generic Haiku verifier, not our named subagent, and blocks the turn.
- Synchronous review inside PostToolUse: adds 30–60 s to every edit.

## Consequences
- Each changed file costs one headless Sonnet run (about 30–40 s). Turn it off by removing the hooks or setting `"disableAllHooks": true` in `.claude/settings.local.json`.
- Files created outside Claude are watched only from the next session onward.
- Hooks are active only when Claude Code is started from `portfolio-website/`.
