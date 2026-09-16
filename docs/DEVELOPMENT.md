# CareerUpAI Development Guide

## Purpose

This guide keeps local development predictable across the frontend and backend.

## Repository layout

- `frontend/` — React + Vite client
- `backend/` — Express API and MongoDB integration
- `docs/` — project and development notes

## Local workflow

1. Install dependencies in the repository root and `frontend/`.
2. Start the backend in development mode.
3. Start the frontend with Vite.
4. Verify the main public pages, authentication flow, dashboard, and career tools before committing.

## Development principles

- Keep UI state separate from API/data state where practical.
- Prefer small reusable components over expanding a single large page file.
- Keep demo/fallback behavior clearly labelled.
- Never commit private keys, tokens, or production credentials.
- Treat loading, empty, error, and success states as part of every feature.

## Before committing

- Run the frontend linter.
- Run the frontend production build.
- Manually check navigation and the primary user flow.
- Confirm no debug logs or temporary secrets were added.
- Use a focused commit message describing one logical change.
