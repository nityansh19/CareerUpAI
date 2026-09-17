# Backend Guide

CareerUpAI uses Express with MongoDB/Mongoose for server-side functionality.

## Responsibilities

The backend should own validation, persistence, sensitive logic and any data that must not be trusted to the browser.

## Route design

- Keep endpoints resource-oriented and predictable.
- Validate input before database operations.
- Return consistent status codes and response shapes.
- Avoid exposing internal stack traces or database details.
- Keep route handlers thin as complexity grows.

## Database access

Centralize reusable queries and avoid repeating business rules across multiple routes. Add indexes only for query patterns that actually need them.

## Error handling

Operational errors should produce useful client responses while unexpected errors should be logged server-side and returned as generic failures.
