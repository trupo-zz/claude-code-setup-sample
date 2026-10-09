#!/usr/bin/env node
// PreToolUse hook: block edits/writes to secret-bearing files AND shell
// commands (Bash / PowerShell tool) that mention a protected path.
// Reads the hook JSON from stdin. Exit 0 = allow, exit 2 = block.
// FAILS CLOSED: parse errors, missing fields, and any uncaught exception exit 2.
// (Claude Code treats only exit 2 as a block; exit 1 would fail OPEN.)
//
// Policy for shell commands: a command is blocked if it MENTIONS a protected
// path token at all, whatever the verb (cat, type, Get-Content, grep, cp ...).
// Exceptions: .env.example / .env.sample / .env.template (non-secret by
// convention) and git status / check-ignore / ls-files segments.
// This is a text filter, not a sandbox. It cannot see through indirection
// (python -c, node -e, variables, $(...) , most globs). See KNOWN-GAPS.txt.
"use strict";

function block(msg) {
  try { process.stderr.write("block-secrets-edit: " + msg + "\n"); } catch (_) {}
  process.exit(2);
}
process.on("uncaughtException", (e) => block("internal error, refusing (fail closed): " + (e && e.message)));
process.on("unhandledRejection", (e) => block("internal error, refusing (fail closed): " + (e && e.message)));

// ---- file path rules (Edit / Write / MultiEdit / NotebookEdit) ----
const EXAMPLE = /\.env\.(example|sample|template)$/i;
const PROTECTED = [
  /(^|[\\/])\.env(\..*)?$/i,
  /(^|[\\/])secrets?([\\/]|$)/i,
  /\.(pem|key|p12|pfx)$/i,
  /(^|[\\/])id_(rsa|ed25519)$/i,
  /(^|[\\/])credentials(\.json)?$/i,
];
function pathProtected(p) {
  const norm = p.replace(/\\/g, "/");
  if (EXAMPLE.test(norm)) return false;
  return PROTECTED.some((re) => re.test(norm));
}

// ---- shell command rules (Bash / PowerShell) ----
// SEP = characters that may precede/follow a path token in a command line.
const SEP = "\\s\"'`=:/\\\\(){}<>|;&,@";
const CMD_PROTECTED = [
  new RegExp("(^|[" + SEP + "])\\.env(\\.[^" + SEP + "]*)?(?=$|[" + SEP + "])", "i"),
  new RegExp("(^|[" + SEP + "])secrets?(?=$|[" + SEP + "])", "i"),
  /\.(pem|key|p12|pfx)(?![\w-])/i,
  /id_(rsa|ed25519)/i,
  new RegExp("(^|[" + SEP + "])credentials(\\.json)?(?=$|[" + SEP + "])", "i"),
];
// Obvious dotenv obfuscation: .e* .en? .[e]nv .{e,x}nv  *env  ?env  .e""nv  .e\nv
const CMD_OBFUSCATION = [
  new RegExp("(^|[" + SEP + "])\\.(e|en)?[*?\\[{]", "i"),
  /[*?\]}]env(?![\w-])/i,
  /\.e["'`\\]+n["'`\\]*v/i,
  /\.en["'`\\]+v/i,
];
const EXAMPLE_ANY = /\.env\.(example|sample|template)(?![\w.-])/gi;
const GIT_SAFE = /^\s*git\s+(status|check-ignore|ls-files)(\s|$)/i;

function commandProtected(cmd) {
  // split into segments so `git status && cat .env` still blocks on the cat part
  const segments = cmd.split(/&&|\|\||[;&|\r\n]/);
  for (let seg of segments) {
    if (GIT_SAFE.test(seg) && !/\$\(|`|<\(|\$\{|\$[A-Za-z_]/.test(seg)) continue;
    seg = seg.replace(EXAMPLE_ANY, "EXAMPLE");
    if (CMD_PROTECTED.some((re) => re.test(seg))) return "mentions a protected path";
    if (CMD_OBFUSCATION.some((re) => re.test(seg))) return "looks like an obfuscated protected path";
  }
  return null;
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("error", () => block("could not read stdin; refusing (fail closed)."));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw.replace(/^\uFEFF/, ""));
  } catch (e) {
    block("could not parse hook input; refusing (fail closed).");
  }
  const ti = input && input.tool_input;
  if (!ti || typeof ti !== "object") block("no tool_input found; refusing (fail closed).");

  const p = ti.file_path || ti.path || ti.notebook_path;
  const cmd = ti.command;
  const hasPath = typeof p === "string" && p.length > 0;
  const hasCmd = typeof cmd === "string" && cmd.trim().length > 0;
  if (!hasPath && !hasCmd) block("no file path or command found; refusing (fail closed).");

  if (hasPath && pathProtected(p)) block("edit to protected file refused: " + p.replace(/\\/g, "/"));
  if (hasCmd) {
    const why = commandProtected(cmd);
    if (why) block("command refused, " + why + ". Protected: .env*, secrets/, *.pem *.key *.p12 *.pfx, id_rsa, id_ed25519, credentials(.json). Example files (.env.example/.sample/.template) are allowed.");
  }
  process.exit(0);
});
