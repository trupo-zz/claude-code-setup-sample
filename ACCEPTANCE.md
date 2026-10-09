# O10 acceptance checklist (client ticks each item)

Terms (delivery, replies, retention, reporting window): see the "Terms" section of SCOPE.md. This refund rule is the same as there.

Refund rule: any item below that FAILS and is still unfixed 48 hours after you report it by email earns a full $149 refund. Report = reply with the item number and what you saw.

- [ ] 1. **Pack delivered:** you received CLAUDE.md, .claude/settings.json, at least one hook script, 2-3 skills, mcp.json and README-HANDOFF.md, and every `{{placeholder}}` is filled (search the files for `{{`: zero hits).
- [ ] 2. **Commands are right:** each install/build/test/lint command in CLAUDE.md runs in your repo as written (you run them; each exits successfully or the failure is explained in the handoff).
- [ ] 3. **Hooks and permissions load:** after copying the pack in, Claude Code starts in your repo with no settings errors, and `/hooks` and `/permissions` show the delivered entries.
- [ ] 4. **Protection works:** the hook blocks or asks for the action named in README-HANDOFF.md (e.g. editing `.env`, or your protected folder); the test commands in the handoff show it. Note: we tested this hook with simulated input, not yet inside a live Claude Code session, and it does not catch bulk or indirect access (see SCOPE.md); a failure of this item still counts under the refund rule.
- [ ] 5. **Skills work:** each delivered skill appears under `/skills` (or is invoked by name) and does what its description says on your repo.
- [ ] 6. **No credentials anywhere:** the pack contains no API key, token, password or private path (search for `sk-ant-`, `sk_live`, `ghp_` and `AKIA`: zero hits); mcp.json only references environment variables.
- [ ] 7. **Undo is documented:** following the handoff's undo steps removes the pack and returns your repo to its prior state.
