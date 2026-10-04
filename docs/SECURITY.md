# Security and data handling

## Device mode

Account passwords are derived using PBKDF2-SHA256, 150,000 iterations, and independent random salts. Browser profile data is account-scoped but unencrypted. Anyone with access to the same browser profile can inspect its storage. Device authentication is an interface boundary, not a secure multi-user service. Backups exclude passwords, tokens, and PDFs.

## Online mode

Passwords use Node scrypt with random 16-byte salts. Legacy plaintext passwords upgrade after successful login. Random 256-bit session tokens are stored only as SHA-256 hashes in MongoDB, expire after seven days, and are revoked on sign-out. The frontend keeps the bearer token in sessionStorage; closing the tab requires a new sign-in.

All user-record endpoints authenticate first. Legacy ID-only data routes were removed. Ownership is enforced for parameterized routes. Passwords and original resume bytes are excluded from user JSON responses. Workspace updates validate nested fields and use version guards to reject stale writes.

Uploads are limited to one PDF, 5 MB, and 10 pages; file signatures are checked. PDFs are stored in the owner's database record. JSON payloads are capped, CORS is restricted, headers prevent content sniffing and framing, and sign-in/API routes have rate limits. Rate limiting uses a per-process memory store; deployments with multiple API instances should use a shared rate-limit store.

No secret, PDF text, password, or token is intentionally logged. Resume text checks are not sent to an external generative AI provider. Preserve database backups and configure retention appropriate to your deployment. Email verification, password-reset email, and automated deletion/retention are not implemented in this release; online activation requires explicit release review.
