# Product status

## Implemented

Guided profiles, local PDF/text review, 12 role checklists, learning milestones and project prompts, an application tracker with exports, interview writing review and history, backups, responsive pages, and regression checks.

## Current infrastructure migration

The previous hosted persistence layer has been removed. The next activation phase is to connect CareerUpAI to Supabase Auth, Postgres, Row Level Security, and Storage, then restore hosted account persistence behind that architecture.

## Activation work

- Create or select the dedicated CareerUpAI Supabase project.
- Define account-owned tables and storage layout.
- Enable Row Level Security on every exposed user-data table.
- Connect Supabase Auth with email confirmation.
- Restore workspace sync and resume persistence.
- Run hosted end-to-end checks before enabling cloud accounts.
- Add account recovery, retention/deletion controls, and production monitoring.

## Future capabilities

Optional generative-AI analysis with clear consent and provider configuration; verified job sources; institution workspaces; premium subscriptions with real billing. None is represented as live today.
