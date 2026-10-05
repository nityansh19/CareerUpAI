# CareerUpAI Development Guide

## Repository layout

- `frontend/` — React + Vite client
- `shared/` — career and resume rules shared by the product
- `docs/` — project and engineering notes

## Local workflow

1. Install frontend dependencies.
2. Start the Vite frontend.
3. Verify public pages, authentication UI, device/sample workspace behavior, and career tools.
4. Keep real hosted accounts disabled until the dedicated Supabase integration passes its security and persistence checks.

## Development principles

- Keep UI state separate from data state where practical.
- Prefer small reusable components.
- Keep demo/fallback behavior clearly labelled.
- Never commit private keys, tokens, or production credentials.
- Only browser-safe Supabase publishable credentials belong in Vite environment variables.
- Treat loading, empty, error, and success states as part of every feature.

## Before committing

```bash
npm test --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
```

Also confirm no debug logs or temporary secrets were added.
