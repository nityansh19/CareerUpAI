# Project Structure

CareerUpAI is split into a React/Vite frontend and an Express/MongoDB backend.

```text
CareerUpAI/
├── frontend/        React application, routes, UI and client-side flows
├── backend/         Express API, database access and server logic
├── docs/            Project documentation and engineering guides
├── README.md        Product overview and quick start
└── package.json     Root backend scripts and dependencies
```

## Frontend

Keep page-level flows, reusable UI, authentication helpers and feature-specific modules separated. Avoid putting unrelated product logic into the main application component.

## Backend

Keep HTTP handling, validation, database logic and reusable services separate as the API grows. Route handlers should stay small enough to understand without tracing unrelated concerns.

## Documentation

Update the relevant guide whenever a change introduces a new setup step, environment variable, architectural convention or release requirement.
