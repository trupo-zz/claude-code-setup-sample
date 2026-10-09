# Claude Code Setup Sprint: $149, done for you

**AI-assisted. Run by Trupo Holding Co.** The files are drafted by an AI model (Claude, by Anthropic). We do not claim that a person reads every pack. We have no customers yet and show no reviews or sales numbers, because there are none.

**[Buy for $149 (Stripe)](https://buy.stripe.com/4gM4gtd760Xg7MK0uL1Jm00)** (one-time payment).

You answer 10 intake questions ([the list](INTAKE.md)). We send back a configuration pack for Claude Code that you commit and use yourself. No subscription, no call, and we never need your keys. [See a free sample pack for a fictional app](README.md).

## The offer, word for word
The two blocks below are copied word for word from our scope document (SCOPE.md, the single source for these terms).

**Claude Code setup sprint, $149, done for you.** You get a config pack tailored to your repo: a `CLAUDE.md` written for your stack and commands, a hooks and permissions baseline (safe read-only commands allowed, destructive commands and Claude's Read tool on secret files denied; the sample shows the secrets-guard hook, which refuses Claude's edit and write tools and shell commands that name `.env`, key or secrets paths, such as `cat .env`; where your repo has a risk area of its own, such as database migrations, we add a rule that asks before touching it), 2-3 skills that fit your daily work, and MCP settings with no credentials in them. Delivery and support are by email: the pack, a hand-off note, and one week of async questions by email after delivery. No call is included. **Secrets protection is a guard against accidents, not a security boundary:** it checks the text of commands, so it does not catch bulk or indirect access (for example `grep -r KEY .`, a glob, a script or `python -c` that builds the file name, or a test run that reads `.env` itself); we have tested the hook with simulated input and have not yet seen it fire inside a live Claude Code session; keep production secrets out of the working folder. **Not included:** writing or fixing your application code, CI/CD or cloud setup, building custom MCP servers, training your team, ongoing support after the week, Claude plan or API costs (you pay those yourself), or any guarantee about what Claude will do on your code. **How we access your work:** you invite us to your repo with a scoped, read-only invite you can revoke, or send a zip of the files we need. We never ask for, accept or store your API keys, passwords or credentials. Everything runs on your own Claude plan or key. If you paste a secret by mistake, tell us and rotate it. Refund: if an item on the 7-item acceptance checklist fails, you report it within 7 days of delivery, and we have not fixed it within 48 hours of your report, you get your $149 back.

## Terms

**Approved short form:** Full $149 refund if an item on the 7-item acceptance checklist fails, you report it within 7 days of delivery, and it is not fixed within 48 hours of your report. Delivery within 3 business days of your intake answers. Email only, no call; we reply within 1 business day.
- **Delivery:** within 3 business days of receiving your intake answers (the 10 questions in INTAKE.md), not from payment. Late delivery: you may cancel for a full refund.
- **Support and replies:** we reply within 1 business day, by email only. One week of async questions by email after delivery. No call is included.
- **Retention:** your intake answers and your pack are kept 14 days after delivery, then deleted on our side. You keep your own copy.
- **Reporting a failed checklist item:** within 7 days of delivery, by email, with the item number and what you saw (ACCEPTANCE.md, 7 items). If we have not fixed it within 48 hours of your report, you get the full $149 back.
- **Not claimed:** no human reads each pack before it ships; the hooks are run against test cases (TESTED.txt) and the output is included.

Where the terms name files: `INTAKE.md` ([the 10 intake questions](INTAKE.md)) and `ACCEPTANCE.md` ([the 7-item acceptance checklist](ACCEPTANCE.md)) are in this repository; `TESTED.txt` is the hook test output included with your pack (an example run is in [`tests/`](tests/)).

## Who runs this, and how to reach us
- **Seller:** Trupo Holding Co, the trade name of an individual (sole proprietor). The operator's legal name, state and a public business email address are **not published yet: they are blocked on the owner's setup and will be added here as soon as they exist.**
- **Before you buy:** open an issue on this repository (needs a free GitHub account). We answer there.
- **After you buy:** we email the address you gave Stripe with the intake questions. Reply to that email for everything else (questions, a failed checklist item, a refund). Email only; reply times are in the Terms above.
- **Stripe checkout shows the seller as "T Holding Co".** It is the same seller. If a checkout page ever shows a different seller or price, do not pay and tell us in an issue.

## What it is not
- Not a custom MCP server, CI pipeline, code change or refactor. We do not change your source code.
- Not a security product: the hook and deny rules are guardrails for Claude's tools, not a boundary.
- Not a promise about how Claude behaves. Configuration steers it; it does not control it.
- Not a call or pairing session. Not unlimited support.

## Privacy in one paragraph
We receive the answers to the intake questions you email us and, if you choose, a read-only repo invite or a zip. The pack is drafted with an AI model (Claude, by Anthropic), so your answers are given to that model: do not put secrets in them. We keep your answers and your pack for 14 days after delivery, then delete them on our side. We never ask for or accept passwords, API keys or `.env` files.

**[Buy for $149 (Stripe)](https://buy.stripe.com/4gM4gtd760Xg7MK0uL1Jm00)** | [Free sample](README.md) | [Acceptance checklist](ACCEPTANCE.md)
