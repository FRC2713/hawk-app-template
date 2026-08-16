# Deployment handoff

Deployment is intentionally separate from novice onboarding. The template produces a normal OCI image but does not publish or deploy itself from a local command.

## Runtime contract

- One container and one replica
- Node listens on `0.0.0.0:$PORT` (default `3000`)
- Persistent writable volume mounted at `/data`
- `GET /health` returns `200` only when SQLite answers
- Ordered migrations run before the server accepts traffic
- Container runs as a non-root user
- Stop signal is `SIGTERM`

SQLite permits only one app replica. Back up `/data/app.db` before upgrades. The app's `npm run db:backup` uses SQLite's online backup API; copying a live WAL database by only copying `app.db` is not a safe backup procedure.

## Hawk Suite

`.hawk/app.yaml` is the machine-readable handoff. It deliberately does not guess Hawk Suite identity header names. Before enabling authorization, obtain the suite's explicit trusted-proxy/header contract, reject direct untrusted access, and map it through one server adapter.

An experienced operator or the Hawk Suite deployment workflow should:

1. Replace the placeholder image reference with an immutable image digest.
2. Provision `/data` and test restore procedures.
3. Configure private service routing and the authenticated proxy.
4. Wait for `/health` during rollout.
5. Keep the prior image and database backup available for rollback.

The GitHub image workflow builds and publishes an image only; it does not alter a running environment.
