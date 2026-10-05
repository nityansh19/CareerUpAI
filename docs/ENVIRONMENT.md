# Environment setup

## Frontend (Vercel root: `frontend`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | HTTPS base URL of the authenticated CareerUpAI API, without a trailing slash. |
| `VITE_API_URL` | `false` or absent: device accounts. `true`: online accounts. Enable only after API version 2 and database connectivity are verified. |

Client variables are public build-time configuration. Never put database credentials in `VITE_` variables. Keep source outside the frontend root available to the build because `shared/careerEngine.mjs` is used by both runtimes. `frontend/vercel.json` provides SPA routing and security headers.

## API (Render or another Node 24 host)

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Required in production; MongoDB connection string. MongoDB must allow the host's network access. |
| `PORT` | Host-supplied listening port; defaults to `5000`. |
| `NODE_ENV` | `production` on the hosted API. |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins, including any preview URL used for online testing. |
| `TRUST_PROXY` | Number of trusted reverse proxies. Defaults to `1` on Render and `0` elsewhere; configure to match the actual host. |
| `RESEND_API_KEY` | Server-only Resend API key used to send verification codes. Never expose this to Vite or commit it. |
| `EMAIL_FROM` | Verified sender identity, for example `CareerUpAI <verify@yourdomain.com>`. |

Install with `npm ci --prefix backend`, start with `npm start --prefix backend`. The root package also delegates startup to the backend. Environment files are examples; the API does not automatically load them. Node 24 supports `--env-file=.env` for local testing.

`GET /health` must report HTTP 200, `version: 3`, `database: connected`, and the `verified-accounts` capability before production sign-in is considered ready. Real Login/Create Account never fall back to a local fake-email account; when the API URL is missing, only the explicit sample workspace remains available.

Existing device accounts are not uploaded automatically. To move progress, export a backup, create an online account after activation, and import the backup. Re-upload the original PDF separately.
