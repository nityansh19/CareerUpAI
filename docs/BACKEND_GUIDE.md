# Backend Guide

CareerUpAI uses Express for server-side validation and protected operations.

## Current migration state

The legacy persistence and custom account-session layer has been removed. Account routes are intentionally migration-gated until Supabase is connected.

## Target responsibilities

The Supabase-backed architecture will use:

- Supabase Auth for identity and email/password sessions.
- Postgres for account-owned workspace data.
- Row Level Security for per-user authorization.
- Supabase Storage for original resume files.
- Express only for operations that should remain server-side, such as controlled document analysis or other sensitive logic.

## Route design

- Keep endpoints resource-oriented and predictable.
- Validate input before persistence operations.
- Return consistent status codes and response shapes.
- Avoid exposing internal stack traces or provider details.
- Keep route handlers thin as complexity grows.

## Security

Authorization must rely on authenticated user identity and ownership checks. Client-supplied user IDs are never sufficient authorization.
