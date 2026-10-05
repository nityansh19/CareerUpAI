# Security and data handling

## Device mode

Account passwords are derived using PBKDF2-SHA256, 150,000 iterations, and independent random salts. Browser profile data is account-scoped but unencrypted. Anyone with access to the same browser profile can inspect its storage. Device authentication is an interface boundary, not a secure multi-user service. Backups exclude passwords, tokens, and PDFs.

## Hosted account migration

The old hosted account/session implementation has been removed. Hosted account routes currently return a migration response instead of attempting persistence. This prevents a half-migrated account system from accepting credentials or writing user data.

The target Supabase design must follow these rules before hosted accounts are enabled:

- Use Supabase Auth for identity, email confirmation, password handling, session refresh and sign-out.
- Use a publishable key in the browser; never expose secret or service-level keys to client code.
- Enable Row Level Security on every exposed user-data table.
- Restrict each user's rows with ownership predicates based on authenticated identity.
- Store original resume files in a private Storage bucket with owner-scoped policies.
- Treat client-supplied IDs and metadata as untrusted input.
- Keep sensitive analysis or privileged actions behind authenticated server checks where needed.
- Validate file type, size and ownership before accepting or returning resume files.

No secret, PDF text, password, or access token should be intentionally logged. Account recovery, deletion/retention behavior and hosted end-to-end security checks must be completed before public online-account activation.
