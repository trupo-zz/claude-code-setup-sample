---
name: pr-summary
description: Write a pull request title and description from the current branch diff. Use when asked for a PR summary.
---

# PR summary

1. Run `git diff main...HEAD --stat` and `git log main..HEAD --oneline`.
2. Output:
   - Title (under 70 characters, imperative mood)
   - What changed (3-6 bullets)
   - Why
   - How it was tested (state whether the test command from `CLAUDE.md` passed)
   - Risks / follow-ups
3. Do not claim tests passed unless you ran them.
4. Do not push or open the PR; only produce text.
