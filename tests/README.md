# Hook tests

- `test-hook.js`: plain-Node test script. Run `node tests/test-hook.js` from the repo root. All input is simulated; no live Claude Code session is involved.
- `TEST-OUTPUT.txt`: output of the original 146-case run in the build workspace (includes template-parity checks for files not in this repo).
- `TEST-OUTPUT-REPO-RUN.txt`: output of this repo's script on this repo's files (142 passed, 0 failed).
- `../KNOWN-GAPS.txt`: what the hook does not block.
