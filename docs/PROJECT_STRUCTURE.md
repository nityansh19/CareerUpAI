# Project Structure

CareerUpAI is a frontend application with shared product intelligence and a Supabase data platform.

```text
CareerUpAI/
├── frontend/        React application, routes, UI and client-side flows
├── shared/          Shared career and resume rules
├── docs/            Product documentation and engineering guides
└── README.md        Product overview and quick start
```

## Frontend

The React/Vite application owns page-level flows, reusable UI, authentication integration, and feature-specific modules.

## Data platform

Supabase will provide authentication, Postgres persistence, Row Level Security, and private file storage. There is no separately hosted custom API server in the current architecture.

## Documentation

Update the relevant guide whenever a change introduces a new setup step, environment variable, architectural convention or release requirement.
