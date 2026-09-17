# Code Style

Keep CareerUpAI code easy to scan, change and review.

## General rules

- Use descriptive names over abbreviations.
- Keep functions focused on one responsibility.
- Prefer early returns to deeply nested conditionals.
- Remove dead code and temporary debug logging before merging.
- Comment decisions that are not obvious from the code itself.

## Frontend

Keep components small enough to understand without scrolling through unrelated concerns. Extract reusable UI and repeated logic when duplication becomes meaningful.

## Backend

Separate validation, persistence and transport concerns as complexity grows. Avoid putting business rules directly into unrelated route handlers.

## Commits

Use messages that explain the actual change, such as `fix: handle missing profile data` or `docs: explain local environment setup`.
