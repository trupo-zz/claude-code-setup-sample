---
name: run-tests
description: Run the Acme Widgets test suite and report failures concisely. Use when asked to run, check or fix tests.
---

# Run tests

1. Run `npm test`.
2. If it fails, list each failing test with file, name and the first relevant error line.
3. Propose the smallest fix. Do not change test expectations unless the user confirms the behaviour is meant to change.
4. Re-run `npm test` and then `npm run lint`; report final status.

Notes: Integration tests in `tests/orders/` are skipped unless `DATABASE_URL` is set; say so in the report rather than treating the skip as a pass.
