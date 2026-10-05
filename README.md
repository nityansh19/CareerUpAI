# CareerUpAI

A connected career workspace for students and early-career builders: review your resume, compare paths, build evidence, and organize your next opportunity.

**[Open CareerUpAI →](https://career-up-ai-delta.vercel.app/)**

## Current product

- **Resume review:** read a PDF on-device or paste text; inspect sections, skill mentions, evidence, and outcomes.
- **12 career paths:** compare software, frontend, backend, Python, AI applications, ML, data analysis, data science, DevOps, mobile, and product design skill checklists.
- **Learning plans:** practical milestones, resources, projects, and persistent progress.
- **Applications:** save and edit opportunities, stages, dates, notes, follow-ups, search, filters, and CSV export.
- **Interview practice:** role-specific prompts, difficulty levels, structured answer checks, and saved session history.
- **Data controls:** export and import a workspace backup.
- **Product experience:** guided onboarding, sample workspace, responsive layouts, keyboard navigation, reduced-motion support, and page-level code splitting.

## Architecture

CareerUpAI no longer uses a separately hosted Express/Render backend.

The target hosted architecture is:

- React + Vite frontend deployed on Vercel
- Supabase Auth for real user accounts and verified email
- Supabase Postgres for user-owned workspace data
- Row Level Security for authorization
- Supabase Storage for private resume files

Until the dedicated CareerUpAI Supabase project is connected, account/workspace data remains device-local.

## Stack

React 19 · Vite · React Router · Tailwind CSS · PDF.js

**Data platform:** Supabase Auth · Postgres · Row Level Security · Storage

## Development

```bash
npm ci --prefix frontend
npm run dev --prefix frontend
```

Verification:

```bash
npm test --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
```

## Structure

```text
frontend/                 React application
frontend/src/auth/        Authentication and onboarding UI
frontend/src/workspace/   Product pages and workspace navigation
frontend/src/lib/         Local persistence, backups, PDF helpers
shared/                   Shared career and resume rules
docs/                     Product and engineering documentation
```

[Environment setup](docs/ENVIRONMENT.md) · [Testing](docs/TESTING.md) · [Security](docs/SECURITY.md) · [Release checks](docs/RELEASE_CHECKLIST.md)
