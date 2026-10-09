// Plain-node test for block-secrets-edit.js and its settings.json command.
// Usage: node tests/test-hook.js
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HOOKS = {
  sample: path.join(ROOT, ".claude/hooks/block-secrets-edit.js"),
};
let pass = 0, fail = 0;
function check(name, ok, extra) {
  if (ok) pass++; else fail++;
  console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  " + (extra || "")));
}
function run(hook, stdin) {
  return spawnSync(process.execPath, [hook], { input: stdin, encoding: "utf8" }).status;
}
const J = (tool, ti) => JSON.stringify({ tool_name: tool, tool_input: ti });


const BLOCK = [], ALLOW = [];
const b = (n, s) => BLOCK.push([n, s]), a = (n, s) => ALLOW.push([n, s]);
// input-shape cases
b("empty input", ""); b("garbage input", "not json at all"); b("missing path (empty tool_input)", J("Edit", {}));
b("missing tool_input", JSON.stringify({ tool_name: "Edit" })); b("JSON null", "null"); b("JSON array", "[]");
b("Bash with no command", J("Bash", {})); b("Bash empty command", J("Bash", { command: "  " }));
b("non-string path", J("Edit", { file_path: 5 }));
b("BOM + .env edit", "\uFEFF" + J("Write", { file_path: ".env" }));
a("BOM + allowed edit", "\uFEFF" + J("Edit", { file_path: "app/main.py" }));
// file tools
for (const p of [".env", "config/.env.production", "secrets/db.json", "deploy\\server.pem", "k.key", "x.p12", "x.pfx", "~/.ssh/id_rsa", "id_ed25519", "credentials.json", "a/credentials", "C:\\r\\.env.local"])
  b("Edit " + p, J("Edit", { file_path: p }));
b("Write .env", J("Write", { file_path: ".env" }));
b("MultiEdit .env", J("MultiEdit", { file_path: ".env" }));
b("NotebookEdit secrets/", J("NotebookEdit", { notebook_path: "secrets/n.ipynb" }));
for (const p of ["app/main.py", "src/routes/orders.ts", "README.md", ".env.example", "config/.env.sample", ".env.template", "docs/secretary.md"])
  a("Edit " + p, J("Edit", { file_path: p }));
// shell reads
const BAD = ["cat .env", "type .env", "Get-Content .env", "gc .env", "less .env", "more .env", "head -5 .env", "tail .env", "tail -f .env.local",
  "grep KEY .env", "rg KEY .env", "Select-String KEY .env", "findstr KEY .env", "sed -n 1p .env", "awk '{print}' .env", "cp .env /tmp/x", "copy .env x.txt",
  "base64 .env", "xxd .env", "strings .env", "source .env", ". .env", "cat < .env", "cat<.env", "cat ./.env", "cat app/.env", "cat .env.production",
  "cat .ENV", "cat '.env'", 'cat ".env"', "cat .\\.env", "Get-Content -Path .\\.env", "cat secrets/x", "cat secrets\\x", "ls secrets", "cat server.pem", "cat a/b.key",
  "cat id_rsa", "cat ~/.ssh/id_rsa", "cat ~/.ssh/id_ed25519", "cat credentials.json", "cat ~/.aws/credentials", "git status && cat .env", "git status; cat .env",
  "echo hi | cat .env", "git show HEAD:.env", "git add .env", "cat .e*", "cat .en?", "cat .[e]nv", "cat .e\"\"nv", "cat .e\\nv", "cat *env", "cat .*", "git status $(cat .env)", "cat app/main.py .env",
  "cat .env.example .env", "echo x > .env", "cat x.pem", "openssl rsa -in k.p12"];
for (const c of BAD) b("Bash: " + c, J("Bash", { command: c }));
for (const c of ["cat .env", "type .env", "Get-Content .env", "gc .env", "cat secrets/x", "cat server.pem", "Get-Content -Raw .\\.env"]) b("PowerShell: " + c, J("PowerShell", { command: c }));
const GOOD = ["cat README.md", "cat app/main.py", "npm test", "git status", "git diff", "git log --oneline", "python -m pytest -q", "ruff check .", "grep -r foo app/",
  "cat .env.example", "cat config/.env.sample", "type .env.template", "git status -s", "git check-ignore .env", "git ls-files .env", "ls -la", "ls", "npm run build", "pip install python-dotenv",
  "cat package.json", "grep -rn TODO src/", "node --check hook.js", "echo secretary", "cat docs/keyboard.md", "head -5 app/main.py", "Get-Content README.md", "python manage.py runserver"];
for (const c of GOOD) a("Bash: " + c, J("Bash", { command: c }));
for (const c of ["cat app/main.py", "npm test", "Get-Content README.md", "git status", "cat .env.example"]) a("PowerShell: " + c, J("PowerShell", { command: c }));

for (const [n, s] of BLOCK) { const st = run(HOOKS.sample, s); check("BLOCK " + n, st === 2, "exit=" + st); }
for (const [n, s] of ALLOW) { const st = run(HOOKS.sample, s); check("ALLOW " + n, st === 0, "exit=" + st); }

// ---- documented gaps: informational, not counted as failures ----
console.log("\n-- KNOWN GAPS (informational; see KNOWN-GAPS.txt) --");
const GAPS = [
  "python -c \"print(open('.en'+'v').read())\"",
  "python -c \"print(open(chr(46)+'env').read())\"",
  "node -e \"console.log(require('fs').readFileSync('.'+'env','utf8'))\"",
  "cat $(echo .e)nv",
  "X=.en; cat ${X}v",
  "cat $HOME/proj/$(echo .)env",
  "find . -name '*nv' -exec cat {} +",
  "ls -a | xargs cat",
  "cat \"$(printf '\\056env')\"",
  "cat $(ls -a | grep ^.en)",
  "Get-ChildItem -Force | Get-Content",
  "powershell -c \"gc ('.'+'env')\"",
  "cat .[a-f]nv",
  "grep -r KEY .",
  "grep -rn password --include=* .",
  "cp -r . /tmp/copy",
  "tar czf x.tgz .",
  "Get-ChildItem -Recurse -Force | Select-String KEY",
  "docker run -v $PWD:/w alpine cat /w/.env".replace("/w/.env","/w/$(ls -a /w | grep en)"),
  "git stash -u && git stash show -p --include-untracked",
  "cat ./e*nv",
  "bash -c \"cat \$(printf %s .e)nv\"",
  "cd secr'e'ts && cat x",
];
for (const c of GAPS) { const st = run(HOOKS.sample, J("Bash", { command: c })); console.log((st === 0 ? "NOT BLOCKED  " : "blocked      ") + c); }

// ---- settings-level tests ----
console.log("\n-- settings.json command, run through a real shell --");
const settings = JSON.parse(fs.readFileSync(path.join(ROOT, ".claude/settings.json"), "utf8"));
const entry = settings.hooks.PreToolUse.find((e) => /block-secrets-edit/.test(e.hooks[0].command));
check("settings matcher is Edit|Write|MultiEdit|Bash|PowerShell", entry && entry.matcher === "Edit|Write|MultiEdit|Bash|PowerShell", entry && entry.matcher);
const cmd = entry.hooks[0].command;
const bashExe = ["C:\\Program Files\\Git\\bin\\bash.exe", "/bin/bash"].find((p) => fs.existsSync(p)) || "bash";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "o10hook-"));
function mkproj(name, hookSrc) {
  const d = path.join(tmp, name);
  fs.mkdirSync(path.join(d, ".claude/hooks"), { recursive: true });
  fs.mkdirSync(path.join(d, "sub/deeper"), { recursive: true });
  if (hookSrc !== null) fs.writeFileSync(path.join(d, ".claude/hooks/block-secrets-edit.js"), hookSrc);
  return d;
}
const src = fs.readFileSync(HOOKS.sample, "utf8");
const withHook = mkproj("withhook", src), noHook = mkproj("nohook", null), spaced = mkproj("my repo", src), broken = mkproj("broken", "this is not javascript (((");
const allowIn = J("Edit", { file_path: "app/main.py" }), blockIn = J("Bash", { command: "cat .env" });
function sh(exe, args, dir, cwd, input) {
  return spawnSync(exe, args, { input, cwd, encoding: "utf8", env: Object.assign({}, process.env, { CLAUDE_PROJECT_DIR: dir }) });
}
const bashRun = (dir, cwd, input) => sh(bashExe, ["-c", cmd], dir, cwd, input);
let r;
r = bashRun(withHook, withHook, allowIn); check("bash: hook present, allowed input -> exit 0", r.status === 0, "exit=" + r.status + r.stderr);
r = bashRun(withHook, withHook, blockIn); check("bash: hook present, `cat .env` -> exit 2", r.status === 2, "exit=" + r.status);
r = bashRun(noHook, noHook, allowIn); check("bash: hook FILE MISSING -> exit 2 (fails closed)", r.status === 2, "exit=" + r.status); console.log("      stderr: " + r.stderr.trim());
r = bashRun(withHook, path.join(withHook, "sub/deeper"), allowIn); check("bash: cwd=subfolder, allowed -> exit 0", r.status === 0, "exit=" + r.status + r.stderr);
r = bashRun(withHook, path.join(withHook, "sub/deeper"), blockIn); check("bash: cwd=subfolder, `cat .env` -> exit 2", r.status === 2, "exit=" + r.status);
r = bashRun("", withHook, allowIn); check("bash: CLAUDE_PROJECT_DIR empty -> exit 2 (fails closed)", r.status === 2, "exit=" + r.status);
r = bashRun(spaced, spaced, allowIn); check("bash: project dir with spaces, allowed -> exit 0", r.status === 0, "exit=" + r.status + r.stderr);
r = bashRun(spaced, spaced, blockIn); check("bash: project dir with spaces, block -> exit 2", r.status === 2, "exit=" + r.status);
r = bashRun(broken, broken, allowIn); check("bash: hook has syntax error (node exit 1) -> wrapper gives exit 2", r.status === 2, "exit=" + r.status);

if (process.platform === "win32") {
  const p = sh("powershell.exe", ["-NoProfile", "-Command", cmd], withHook, withHook, allowIn);
  console.log("INFO powershell.exe running the bash-syntax command (hook present, allowed input): exit=" + p.status + " (not asserted; command is bash syntax)");
  const q = sh("powershell.exe", ["-NoProfile", "-Command", cmd], noHook, noHook, allowIn);
  console.log("INFO powershell.exe, hook missing: exit=" + q.status);
}
try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) {}
console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
