# Release checks

## Device workspace release

- Frontend regression tests, lint, and production build pass.
- Public content describes rule-based reviews and device storage accurately.
- SPA deep links, responsive layouts, loading states, and keyboard controls work.
- New device accounts start empty; sample data is explicitly labelled.
- Workspace backups can be exported and restored.

## Supabase account activation

Do not enable hosted accounts until all of these pass:

- A dedicated CareerUpAI Supabase project is selected.
- Supabase Auth email/password signup and email confirmation work.
- User-data tables are created with the required grants.
- Row Level Security is enabled on every exposed table.
- Policies restrict reads/inserts/updates/deletes to the authenticated owner.
- Resume Storage is private and owner-scoped.
- The frontend uses only the project URL and publishable key.
- No secret/service key is present in the frontend.
- Cross-account access attempts are rejected.
- Persistence works across reloads and devices.
- Sign-out, expired sessions and password recovery are verified.
- Frontend tests, lint and production build pass.

Payments, live job feeds, and generative AI are not enabled or advertised as functioning features in this release.
