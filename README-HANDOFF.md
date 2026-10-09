# Acme Widgets - Claude Code config pack

Delivered 2026-10-08. Stack: TypeScript, Node 20, Express, Postgres, Vitest, ESLint.

## Install
1. Unzip the pack into the root of your repo (same level as `package.json` or equivalent).
2. Rename `mcp.json` to `.mcp.json` (project-scoped MCP config). Set `GITHUB_TOKEN` in your own shell environment if you want the GitHub server. The pack contains no credentials.
3. Commit it on a branch (one command per line; PowerShell 5.1 has no `&&`):
   ```
   git checkout -b chore/claude-setup
   git add CLAUDE.md .claude .mcp.json
   git commit -m "Add Claude Code config pack"
   ```
4. Requires Node 18+ for the hook. Start Claude Code in the repo and run `/permissions` and `/hooks` to confirm they loaded.

## Check that protection works
Run in PowerShell, from any folder (in bash use `printf '%s'` and `$CLAUDE_PROJECT_DIR`). Set the variable once (the first line below uses the current folder, so run it from your repo root); each line then prints the hook output and its exit code.
```
$env:CLAUDE_PROJECT_DIR = (Get-Location).Path   # run this from your repo root
'{"tool_name":"Write","tool_input":{"file_path":".env"}}' | node "$env:CLAUDE_PROJECT_DIR/.claude/hooks/block-secrets-edit.js"; $LASTEXITCODE
'{"tool_name":"Edit","tool_input":{"file_path":"src/app.js"}}' | node "$env:CLAUDE_PROJECT_DIR/.claude/hooks/block-secrets-edit.js"; $LASTEXITCODE
'{"tool_name":"Bash","tool_input":{"command":"cat .env"}}' | node "$env:CLAUDE_PROJECT_DIR/.claude/hooks/block-secrets-edit.js"; $LASTEXITCODE
'{"tool_name":"Bash","tool_input":{"command":"cat README.md"}}' | node "$env:CLAUDE_PROJECT_DIR/.claude/hooks/block-secrets-edit.js"; $LASTEXITCODE
```
Expected: the `.env` write and the `cat .env` command each print a refusal message and `2`; the `src/app.js` edit and `cat README.md` print nothing and `0`.

## Limits
The secrets hook blocks edits to protected files and any Bash/PowerShell command that mentions `.env*`, `secrets/`, `*.pem`/`*.key`/`*.p12`/`*.pfx`, `id_rsa`, `id_ed25519` or `credentials(.json)`. `.env.example`, `.env.sample` and `.env.template` are allowed. It is a text filter, not a sandbox: commands that build the path indirectly (for example a script that opens the file, or shell variables and substitutions) are not caught. Keep real secrets out of the repo folder where you can.

## Undo
Delete `CLAUDE.md`, `.claude/` and `.mcp.json`, or run `git revert --no-edit HEAD` on the commit from install step 3. Nothing outside the repo is changed.

## What each file does
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project brief Claude reads each session: commands, conventions, do/don't, gotchas |
| `.claude/settings.json` | Permissions (read-only git/test/lint allowed; `.env*`, secrets, destructive rm and force-push denied) and the hook registration |
| `.claude/hooks/block-secrets-edit.js` | Blocks edits to `.env*`, keys, secrets folders, and shell commands (Bash/PowerShell) that mention them; fails closed on bad input. Best-effort filter, not a sandbox: see Limits below |
| `.claude/skills/run-tests/` | Runs tests and reports failures |
| `.claude/skills/pr-summary/` | Drafts a PR description from the branch diff |
| `.claude/skills/repo-onboarding/` | Orients a new session or developer |
| `.mcp.json` | Example MCP servers; credentials come from environment variables only |

## Support
Support: one week of async questions by email from delivery. No call is included. Nothing beyond that is included.
