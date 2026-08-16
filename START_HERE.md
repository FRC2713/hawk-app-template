# Start here

You do not need to know programming vocabulary. Open this folder in Codex or Claude Code and paste the first prompt below.

## 1. Describe the app

```text
Read AGENTS.md, START_HERE.md, and APP_BRIEF.md. Interview me one question at a time about the small internal app I want. Use plain language and give examples when I am unsure. Then fill in APP_BRIEF.md. Do not change application code yet.
```

Review the filled-in brief. It should say who uses the app, the few things they need to do, what information is stored, and what is explicitly out of scope.

## 2. Plan one feature

```text
Read AGENTS.md and APP_BRIEF.md. Plan the smallest useful first feature. Write or update one file in docs/features with visible behavior, non-goals, acceptance examples, data changes, and a verification plan. Do not implement it yet. Explain the plan without jargon.
```

## 3. Build the approved feature

```text
Implement the approved feature plan. Preserve the repository architecture and use the existing project feature as the pattern. Run the relevant tests and npm run check. Do not deploy or commit. Tell me exactly what changed and what I should try in the browser.
```

## 4. Diagnose a problem

```text
Run npm run doctor, reproduce the problem safely, and explain the cause in plain language. Do not change code until you have identified the cause. Then propose the smallest fix.
```

## 5. Prepare a deployment handoff

```text
Read docs/DEPLOYMENT.md and .hawk/app.yaml. Run all local verification, inspect the container and data requirements, and prepare a deployment handoff report. Do not deploy, publish, commit, or change Hawk Suite.
```

## Safety net

Your data lives in `data/app.db`. Ask the agent to run `npm run db:backup` before a risky data change. If a command reports an error, paste the full error back into the same conversation.
