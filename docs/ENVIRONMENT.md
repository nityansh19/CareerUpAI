# Environment Configuration

Keep environment-specific values outside source code and never commit real credentials.

## Local setup

Use checked-in example files when available and create local environment files for machine-specific values.

Typical configuration categories include:

- API base URLs
- Database connection strings
- Authentication secrets
- Third-party service keys
- Feature flags

## Rules

1. Do not commit secrets, tokens or private keys.
2. Document every required variable and its purpose.
3. Fail clearly when a required variable is missing.
4. Keep development and production values separate.
5. Rotate any credential that is accidentally exposed.

## Review checklist

Before deployment, confirm that production variables exist in the hosting platform and that no local-only values are hardcoded into the client bundle.
