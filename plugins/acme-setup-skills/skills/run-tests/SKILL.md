---
name: run-tests
description: Run the project's test suite and report failures concisely. Use when asked to run, check or fix tests.
---

# Run tests

1. Read the test command from `CLAUDE.md` and run it.
2. If it fails, list each failing test with file, name and the first relevant error line.
3. Propose the smallest fix. Do not change test expectations unless the user confirms the behaviour is meant to change.
4. Re-run the test command and then the lint command from `CLAUDE.md`; report final status.

Notes: If `CLAUDE.md` says some tests are skipped unless an environment variable is set, say so in the report rather than treating the skip as a pass.
