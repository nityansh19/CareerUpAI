# CareerUpAI Development Guide

## Purpose

This guide keeps local development predictable across the frontend and backend.

## Repository layout

- `frontend/` — React + Vite client
- `backend/` — Express API shell prepared for Supabase integration
- `shared/` — career and resume rules shared across runtimes
- `docs/` — project and development notes

## Local workflow

1. Install frontend and backend dependencies.
2. Start the backend in development mode.
3. Start the frontend with Vite.
4. Verify public pages, device/sample workspace behavior, and career tools before committing.
5. Keep hosted account mode disabled until the Supabase integration passes its security and persistence checks.

## Development principles

- Keep UI state separate from API/data state where practical.
- Prefer small reusable components over expanding a single large page file.
- Keep demo/fallback behavior clearly labelled.
- Never commit private keys, tokens, or production credentials.
- Treat loading, empty, error, and success states as part of every feature.

## Before committing

- Run backend and frontend tests.
- Run the frontend linter.
- Run the frontend production build.
- Confirm no debug logs or temporary secrets were added.
- Use a focused commit message describing one logical change.
