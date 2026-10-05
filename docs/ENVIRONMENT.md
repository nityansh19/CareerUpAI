# Environment setup

## Frontend

CareerUpAI is a React/Vite application deployed on Vercel.

The dedicated CareerUpAI Supabase project will provide the hosted data/auth layer directly.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Public URL for the CareerUpAI Supabase project. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public Supabase key intended for browser use. |

These variables are public build-time configuration. Never put a Supabase secret/service key in a `VITE_` variable.

## Current migration state

The previous external API host has been removed from the repository and the legacy `VITE_API_URL` connection is no longer used by the application.

Until Supabase is connected, the app keeps account/workspace data on the device.

## Local development

```bash
npm ci --prefix frontend
npm run dev --prefix frontend
```

Copy `frontend/.env.example` to your local environment when the Supabase project is ready and fill in the project URL and publishable key.
