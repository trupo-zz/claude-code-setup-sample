# Claude Code setup pack: sample for a fictional app

This is a **sample**. It shows what a Claude Code configuration pack looks like, using a made-up app called "Acme Widgets". It is **not** a client's repository, and nothing in it describes a real product. The app code does not exist here; only the configuration files do.

It is the sample for the "Claude Code Setup Sprint" offered by Trupo Holding Co. The offer, its price ($149 one time) and what is included are on the payment page: https://buy.stripe.com/4gM4gtd760Xg7MK0uL1Jm00 . This repository is just the sample, and it is free to read and reuse under the MIT licence.

**AI-assisted.** These files were drafted with an AI model (Claude, by Anthropic) and run by Trupo Holding Co. We do not claim that a person reads every pack.

## What each file does

| File | What it does |
|------|--------------|
| `CLAUDE.md` | The project brief Claude reads each session: commands, conventions, do and don't lists, gotchas (all for the fictional Acme Widgets app). |
| `.claude/settings.json` | Permissions (read-only git, test, lint and build commands allowed; reading `.env*` and `secrets/`, `rm -rf`, force-push and `git reset --hard` denied) and the registration of the secrets-guard hook. |
| `.claude/hooks/block-secrets-edit.js` | The secrets-guard hook (needs Node 18+). Refuses Claude's edit and write tools, and shell commands, that name `.env`, key or secrets paths. Fails closed if its input cannot be read. |
| `.claude/skills/run-tests/` | Skill: run the tests and report failures. |
| `.claude/skills/pr-summary/` | Skill: draft a pull-request description from the branch diff. |
| `.claude/skills/repo-onboarding/` | Skill: orient a new session or developer in the repo. |
| `mcp.json` | Example MCP servers. Credentials come only from environment variables; the file contains none. Rename it to `.mcp.json` to use it. |
| `README-HANDOFF.md` | The hand-off note a client receives: install steps, how to check protection works, how to undo. |
| `KNOWN-GAPS.txt` | The full list of what the secrets hook does and does not catch. |
| `tests/` | The hook tests and their output (see below). |
| `LICENSE` | MIT. |

## About the secrets protection

**Secrets protection is a guard against accidents, not a security boundary:** it checks the text of commands, so it does not catch bulk or indirect access (for example `grep -r KEY .`, a glob, a script or `python -c` that builds the file name, or a test run that reads `.env` itself); we have tested the hook with simulated input and have not yet seen it fire inside a live Claude Code session; keep production secrets out of the working folder.

## Tests

`tests/TEST-OUTPUT.txt` is the output of the 146-case hook test run, recorded in the workspace where the pack was built. That run also compared this hook with the unpublished pack template, so two of its lines (and a few settings checks) refer to files that are not in this repository.

`tests/test-hook.js` is the same test script with those template-only checks removed, so it runs against this repo: `node tests/test-hook.js` (Node 18+; the shell-wrapper checks use bash). Its output when we ran it on the files in this repo is in `tests/TEST-OUTPUT-REPO-RUN.txt` (142 passed, 0 failed). All cases use simulated hook input.

## Licence

MIT, see `LICENSE`.
