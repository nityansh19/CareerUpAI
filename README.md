# CareerUpAI

A connected career workspace for students and early-career builders: review your resume, compare paths, build evidence, and organize your next opportunity.

**[Open CareerUpAI →](https://career-up-ai-delta.vercel.app/)**

## Current product

- **Real resume text review:** read a PDF on-device or paste text; inspect contact details, sections, skill mentions, and outcomes.
- **12 career paths:** compare software, frontend, backend, Python, AI applications, ML, data analysis, data science, DevOps, mobile, and product design skill checklists.
- **Learning plans:** practical milestones, official learning resources where available, projects, and persistent progress.
- **Applications:** save and edit opportunities, stages, dates, notes, and follow-ups; search, filter, and export CSV.
- **Interview practice:** role-specific prompts, three difficulty levels, structured answer checks, and saved session history.
- **Data controls:** export a credential-free workspace backup and merge an import.
- **Product experience:** guided onboarding, an explicit sample workspace, responsive layouts, keyboard navigation, loading and recovery states, reduced-motion support, and page-level code splitting.

Reviews use transparent rules, not a generative AI service. Resume scores are not ATS pass rates; career percentages describe skill-checklist coverage, not hiring probability.

## Data modes

**Device mode remains available during the migration.** Profiles, learning progress, applications, and interview history can stay in the browser while the hosted account system is being moved to Supabase.

**Hosted accounts are currently migration-gated.** The previous database/session implementation has been removed from the backend. The API intentionally returns a migration response for account routes until Supabase Auth, Postgres tables, Row Level Security, and Storage are connected and verified.

## Stack

React 19 · Vite · React Router · Tailwind CSS · PDF.js · Node.js · Express · Node test runner

**Next infrastructure:** Supabase Auth · Postgres · Row Level Security · Storage

## Development

```bash
npm ci --prefix frontend
npm ci --prefix backend
npm run dev --prefix frontend
```

Run the API with:

```bash
npm start --prefix backend
```

The API does not automatically load `.env` files. For local Node development with a copied `backend/.env`, use `node --env-file=.env server.js` from the backend directory. Never commit actual credentials.

```bash
npm test --prefix frontend
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```

## Structure

```text
frontend/src/auth/       Account UI, sessions, onboarding
frontend/src/workspace/  Individual product pages and navigation
frontend/src/lib/        Persistence, backups, PDF extraction
shared/                  Career and resume rules engine
backend/                 Express API shell and validation
docs/                    Product and engineering documentation
```

[Environment setup](docs/ENVIRONMENT.md) · [Testing](docs/TESTING.md) · [Security](docs/SECURITY.md) · [Release checks](docs/RELEASE_CHECKLIST.md)
