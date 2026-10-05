# Environment setup

## Frontend (Vercel root: `frontend`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | HTTPS base URL of the CareerUpAI API, without a trailing slash. |
| `VITE_CLOUD_ACCOUNTS` | Keep `false` until the Supabase account migration is complete and verified. |

Client variables are public build-time configuration. Never put secret database credentials in `VITE_` variables.

## API

| Variable | Purpose |
| --- | --- |
| `PORT` | Host-supplied listening port; defaults to `5000`. |
| `NODE_ENV` | Use `production` on the hosted API. |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins, including any preview URL used for online testing. |
| `TRUST_PROXY` | Number of trusted reverse proxies. Defaults to `1` on Render and `0` elsewhere. |

Install with `npm ci --prefix backend` and start with `npm start --prefix backend`.

During the migration, `GET /health` reports `version: 3` and `database: supabase-migration-pending`. Account routes intentionally return `SUPABASE_MIGRATION_PENDING` until the Supabase schema and Auth integration are connected.

Supabase URL and publishable-key variables will be added in the connection step. Secret or service-level keys must never be exposed through Vite.
