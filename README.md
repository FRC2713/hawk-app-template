# Hawk App Template

A self-contained starter for small internal web applications. It is designed for someone who may not program, but can describe what they want to Codex or Claude Code.

The template includes a polished project tracker as a complete example: list, filter, create, view, edit, validate, and delete. Replace that example with your own application one feature at a time.

## Start here

1. Install [Node.js 24 LTS](https://nodejs.org/).
2. Open this folder in Codex or Claude Code.
3. Follow [START_HERE.md](./START_HERE.md).

The normal local workflow is only:

```sh
npm install
npm run doctor
npm run dev
```

Open <http://localhost:3000>. The app needs no account, cloud service, or secret to run locally.

## Useful commands

| Command                     | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `npm run dev`               | Migrate, add sample data, and start the app        |
| `npm run doctor`            | Explain local setup problems in plain language     |
| `npm run check:render`      | Check the running app really renders, not just 200 |
| `npm run check`             | Format-check, type-check, test, and build          |
| `npm run verify`            | Run every check, including browser flows           |
| `npm run db:backup`         | Save a timestamped SQLite backup                   |
| `docker compose up --build` | Run production-like in Docker                      |

Local data is stored in `data/app.db` and ignored by Git. This is local-data-first, not an offline-sync architecture: the browser still connects to the running server.

## Technology

- Node.js 24, npm, strict TypeScript
- Astro 7 server-rendered pages and Actions
- React 19 only for interactive leaf widgets
- Tailwind CSS 4 with curated, source-owned shadcn/ui components
- Hawk Shop-derived branding with locally bundled Inter Variable
- SQLite through `better-sqlite3`, with ordered SQL migrations
- Vitest and Playwright
- One non-root Docker container with `/health` and a `/data` volume

See [docs/BRANDING.md](./docs/BRANDING.md) for the shared Hawk interface rules, [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) before changing a major boundary, and [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) before handing the app to an operator.
