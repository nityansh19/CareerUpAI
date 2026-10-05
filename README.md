# CareerUpAI

A connected career workspace for students and early-career builders: review your resume, compare paths, build evidence, and organize your next opportunity.

**[Open CareerUpAI →](https://career-up-ai-delta.vercel.app/)**

## Current product

- **Real resume text review:** read a PDF on-device or paste text; inspect contact details, sections, skill mentions, and outcomes. Download the original PDF or a plain-text review.
- **12 career paths:** compare software, frontend, backend, Python, AI applications, ML, data analysis, data science, DevOps, mobile, and product design skill checklists. Set a target role.
- **Learning plans:** practical milestones, official learning resources where available, projects, and persistent progress.
- **Applications:** save and edit opportunities, stages, dates, notes, and follow-ups; search, filter, and export CSV.
- **Interview practice:** role-specific prompts, three difficulty levels, structured answer checks, and saved session history.
- **Data controls:** export a credential-free workspace backup and merge an import. Original PDFs are downloaded separately.
- **Product experience:** guided onboarding, an explicit sample workspace, responsive layouts, keyboard navigation, loading and recovery states, reduced-motion support, and page-level code splitting.

Reviews use transparent rules, not a generative AI service. Resume scores are not ATS pass rates; career percentages describe skill-checklist coverage, not hiring probability. The app does not fetch live job listings or submit applications. Current core tools are free; premium checkout is not active.

## Account modes

**Login and Create Account use verified online accounts.** The Express API hashes passwords, sends a 6-digit email verification code, creates sessions only after the email is verified, enforces account ownership, stores workspaces in MongoDB, and supports revocable sessions.

**The sample workspace is separate.** It remains available without an account for product exploration, but it is not treated as a real login and does not bypass email verification.

## Stack

React 19 · Vite · React Router · Tailwind CSS · locally hosted Manrope · PDF.js · Node.js · Express · Mongoose/MongoDB · Node crypto · Node test runner

## Development

```bash
npm ci --prefix frontend
npm ci --prefix backend
npm run dev --prefix frontend
```

For the API, set `MONGODB_URI`, `RESEND_API_KEY`, and `EMAIL_FROM` in the hosting environment or shell, then run:

```bash
npm start --prefix backend
```

The API does not automatically load `.env` files. For local Node 24 development with a copied `backend/.env`, use `node --env-file=.env server.js` from the backend directory. Never commit actual credentials.

```bash
npm test --prefix frontend
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```

## Structure

```text
frontend/src/auth/       Accounts, sessions, onboarding
frontend/src/workspace/  Individual product pages and navigation
frontend/src/lib/        Persistence, backups, PDF extraction
shared/                 One career and resume rules engine
backend/                Protected API, models, validation
frontend/tests/          Device-account and analysis regression tests
backend/tests/           Security and API contract tests with fixture PDF
```

[Environment setup](docs/ENVIRONMENT.md) · [Testing](docs/TESTING.md) · [Security](docs/SECURITY.md) · [Release checks](docs/RELEASE_CHECKLIST.md)
