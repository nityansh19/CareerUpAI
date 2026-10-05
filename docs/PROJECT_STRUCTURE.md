# Project Structure

CareerUpAI is split into a React/Vite frontend, an Express API shell, shared career logic, and documentation.

```text
CareerUpAI/
├── frontend/        React application, routes, UI and client-side flows
├── backend/         Express API shell, validation and future Supabase server operations
├── shared/          Shared career and resume rules
├── docs/            Product documentation and engineering guides
├── README.md        Product overview and quick start
└── package.json     Root scripts
```

## Frontend

Keep page-level flows, reusable UI, authentication helpers and feature-specific modules separated.

## Backend

Keep HTTP handling, validation and privileged server logic separate. Supabase-backed persistence will be introduced behind explicit service modules rather than mixed directly into route handlers.

## Documentation

Update the relevant guide whenever a change introduces a new setup step, environment variable, architectural convention or release requirement.
