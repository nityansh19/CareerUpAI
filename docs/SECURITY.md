# Security Notes

CareerUpAI should treat all browser input as untrusted.

## Baseline rules

- Validate and sanitize request data on the server.
- Keep secrets and database credentials server-side.
- Never expose stack traces or sensitive configuration in API responses.
- Restrict CORS to intended origins for production.
- Use secure authentication/session settings when authentication is enabled.
- Apply rate limiting to abuse-prone endpoints.
- Keep dependencies updated and review high-severity advisories.

## Data handling

Store only data the product actually needs. Avoid logging passwords, access tokens or other sensitive values.

## Reporting

Security-sensitive findings should be fixed privately before being described publicly in detail.
