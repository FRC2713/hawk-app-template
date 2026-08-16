# Agent guide

This repository is intentionally narrow. Preserve its simplicity for a novice operator. `CLAUDE.md` points here so Codex and Claude use the same rules.

## Before changing code

1. Read `APP_BRIEF.md`, `docs/BRANDING.md`, and the relevant file in `docs/features/`.
2. Restate the requested user-visible behavior and non-goals.
3. Inspect the existing vertical slice before adding a new pattern.
4. Do not deploy, edit Hawk Suite, publish an image, or add a hosted service unless the user explicitly asks.

## Architecture rules

- Use Astro pages for routes and server-rendered UI.
- Use Astro Actions for app-owned form mutations. Every action validates input and enforces any applicable authorization.
- Use React only for a contained interactive leaf in `src/components/islands/`. Do not split one workflow across multiple islands.
- Follow `docs/BRANDING.md`. Use semantic tokens and existing source-owned UI patterns; do not invent product colors, logos, fonts, or voice conventions.
- Keep SQL in `src/server/` repositories. Pages and actions call repository functions.
- Change the schema only by adding an ordered `migrations/NNNN_name.sql` file. Never edit an applied migration.
- Store durable state beneath `DATA_DIR`; production mounts it at `/data`.
- Do not add an ORM, client state library, auth provider, queue, or cloud database without a concrete requirement and an approved architecture change.
- Hawk Suite authentication is outside this app. When its identity-header contract is available, implement one narrow trusted-proxy adapter and authorize server-side; never trust a browser-supplied identity header directly.

## File map

- `src/pages/`: routes and request rendering
- `src/actions/`: validated mutations
- `src/server/`: configuration, database, repositories, logging
- `src/components/ui/`: reusable Astro presentation
- `src/components/islands/`: exceptional interactive React widgets
- `migrations/`: immutable, ordered SQL
- `docs/features/`: behavior and acceptance examples
- `docs/BRANDING.md`: canonical visual, voice, and accessibility rules
- `.hawk/app.yaml`: deployment handoff contract

## Definition of done

- Behavior and errors are understandable without developer tools.
- Keyboard, labels, focus, empty states, and mobile layout are considered.
- Tests cover domain/repository behavior and critical browser journeys.
- `npm run check` passes. Run `npm run verify` for user-flow or deployment changes.
- Documentation and `.env.example` match runtime behavior.
- Summarize changed files and checks; never commit unless the user explicitly asks.

Use `npm run doctor` for setup diagnosis. Prefer existing patterns over new dependencies.
