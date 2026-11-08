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

`.hawk/app.yaml` is the machine-readable handoff. The sample declares `auth.mode: none` and implements no authentication. This is a valid choice for applications whose intended audience and data permit it. Do not add authentication merely because an app is deployed in Hawk Suite.

Choose access behavior from the application brief:

- **No authentication:** keep `mode: none`; do not consume identity headers or add login UI.
- **Gateway login only:** request `mode: hawk-suite-proxy` in the handoff. The operator configures the gateway; the app need not implement sessions or know the user's identity.
- **User-aware features:** additionally implement a small server-side adapter for the contract below, only for features that need identity or permissions.

The handoff records intent; changing its mode does not itself configure Caddy or secure an exposed app. Local development need not require a live Slack connection. Any test identity must be explicitly confined to development/tests, never a production fallback.

### Optional Suite identity headers

Hawk Suite can forward the following headers after Caddy/AuthCrunch validates a Slack session:

| Header | Meaning |
| --- | --- |
| `X-Token-Subject` | Stable `slack:<workspace>:<user>` identity |
| `X-Hawk-Slack-Team` | Verified Slack workspace ID |
| `X-Hawk-Slack-User` | Verified Slack user ID |
| `X-Token-User-Name` | Optional display name |
| `X-Token-User-Email` | Optional email |
| `X-Token-User-Roles` | Space-separated gateway roles, including `suite/member` |

Confirm that the deployed gateway supplies this contract before enabling its consumption. See [Hawk Suite's deployment guide](https://github.com/FRC2713/hawk_suite/blob/main/docs/continuous-deployment.md#downstream-identity-contract) for the authoritative deployment behavior; availability depends on the deployed release.

The gateway clears caller-supplied headers before authentication and injects verified values afterward. Public exceptions and apps bypassing Suite authentication receive none. Headers are not independently signed: trust requires an app reachable only through the configured proxy, with no published backend ports or untrusted containers on its private network. The host and proxy are trusted.

When consuming identity, require the configured workspace, matching subject/user IDs, and `suite/member`; reject missing or inconsistent identity on protected operations. Do not infer authentication from a supplied name/email or a browser form field. Escape display values. Gateway roles are not Slack user-group memberships and do not automatically grant administrator rights. App-specific permissions remain server-side product decisions, not template defaults.

Reuse the gateway's login/session/logout for Suite browser authentication rather than adding a second Slack login, signing service, or auth database. Existing integration authorization (for example, connecting another service) is a separate concern. Keep Origin/CSRF protections for browser mutations.

For an app adopting this contract, test valid identity, missing/malformed headers, denied permissions, and gateway removal/replacement of forged headers. Public apps do not need an authentication subsystem or auth-specific tests.

An experienced operator or the Hawk Suite deployment workflow should:

1. Replace the placeholder image reference with an immutable image digest.
2. Provision `/data` and test restore procedures.
3. Configure routing and, only if requested by the handoff, the Suite login gate and trusted identity forwarding.
4. Wait for `/health` during rollout.
5. Keep the prior image and database backup available for rollback.

The GitHub image workflow builds and publishes an image only; it does not alter a running environment.
