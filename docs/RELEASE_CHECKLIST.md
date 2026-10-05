# Release checks

## Device workspace release

- Regression tests, frontend lint, and production build pass.
- Public content describes rule-based reviews and device storage accurately.
- SPA deep links, responsive layouts, loading states, and keyboard controls work.
- New accounts start empty; sample data is explicitly labelled.
- Original PDFs and workspace backups can be downloaded separately.
- Review text, application notes, and interview drafts survive a reload.

## Supabase account activation

Do not enable hosted accounts until all of these pass:

- A dedicated CareerUpAI Supabase project is selected and documented.
- Supabase Auth email/password sign-up and email confirmation work.
- User-data tables exist with explicit grants where required.
- Row Level Security is enabled on every exposed table.
- RLS policies restrict reads/inserts/updates/deletes to the authenticated owner.
- Resume Storage is private and owner-scoped.
- The frontend uses only the project URL and publishable key.
- Secret/service keys exist only in trusted server environments.
- Cross-account access attempts are rejected.
- Persistence works across reloads and devices.
- Sign-out and expired-session behavior are verified.
- Backend and frontend tests, lint and production builds pass.

Keep `VITE_CLOUD_ACCOUNTS=false` until this checklist is complete.

Payments, live job feeds, and generative AI are not enabled or advertised as functioning features in this release.
