# Architecture

## Shape

The application is one Node process and one SQLite file. Astro renders pages on the server. Forms call Astro Actions, which validate input and call typed repository functions. React is reserved for small interaction-rich leaves such as the delete dialog.

```text
browser -> Astro page/action -> repository -> SQLite file
              |
              +-> optional React leaf island
```

This shape minimizes duplicated client/server contracts and works both on a laptop and in one container.

## Decisions

- Server-rendered forms are the default because they work before JavaScript loads and keep mutations close to validation.
- Raw, parameterized SQL and checked-in migrations keep the data model visible. An ORM is not needed for this scale.
- SQLite is correct for one running application instance. Move to Postgres only when concurrent instances, external reporting, or a separate web client creates a real need.
- Tailwind supplies design tokens and layout utilities. The reusable UI source stays in this repo; arbitrary component registries are not a dependency.
- Authentication is not embedded. Hawk Suite will terminate public access and provide a documented identity contract. Authorization still belongs in server actions and routes.

## Adding a feature

Add one behavior specification under `docs/features/`, then build vertically: migration, repository, action, page, browser journey. Prefer adapting the projects example over inventing a second pattern.

## Boundaries

This is local-data-first, meaning local development has no hosted dependencies. It is not browser-offline-first. Offline synchronization would require a separate client database, conflict rules, and an explicit product decision.
