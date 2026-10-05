# Product status

## Implemented

Guided profiles, local PDF/text review, 12 role checklists, learning milestones and project prompts, an application tracker with exports, interview writing review and history, backups, responsive pages, and regression checks.

## Current infrastructure migration

CareerUpAI has removed its previous custom database and separately hosted API infrastructure.

The next activation phase is a direct Supabase integration:

- dedicated CareerUpAI Supabase project,
- Supabase Auth,
- Postgres user/workspace tables,
- Row Level Security,
- private Supabase Storage for resumes,
- direct frontend integration using browser-safe project credentials.

## Activation work

- Create or select a dedicated CareerUpAI Supabase project.
- Define account-owned tables.
- Enable RLS on all exposed user-data tables.
- Connect signup/login and email confirmation.
- Migrate local workspace operations to Supabase.
- Add private resume storage.
- Verify cross-account isolation.
- Add password recovery, account deletion and retention controls.
- Run hosted end-to-end checks before enabling real online accounts.

## Future capabilities

Optional generative-AI analysis with clear consent and provider configuration; verified job sources; institution workspaces; premium subscriptions with real billing.
