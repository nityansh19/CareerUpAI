# API Conventions

Keep the CareerUpAI API predictable so frontend code does not need endpoint-specific workarounds.

## Responses

Use consistent JSON response shapes for successful data, validation errors and unexpected failures. Do not expose internal implementation details.

## Status codes

- `200` / `201` for successful operations.
- `400` for invalid client input.
- `401` / `403` for authentication or authorization failures.
- `404` for missing resources.
- `500` for unexpected server failures.

## Naming

Prefer clear resource names and stable field names. Avoid changing response keys without updating every consumer and the relevant docs.

## Validation

Validate request body, params and query values at the API boundary before database work begins.
