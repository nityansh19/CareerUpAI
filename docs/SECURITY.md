# Security and data handling

## Device mode

Device account passwords are derived locally and browser profile data is account-scoped but unencrypted. Anyone with access to the same browser profile can inspect browser storage. Device authentication is an interface boundary, not a secure multi-user cloud service.

## Supabase target architecture

Hosted accounts will use Supabase directly.

Security requirements before activation:

- Supabase Auth handles password storage, email confirmation, password recovery and sessions.
- The browser uses only the project URL and publishable key.
- Secret/service keys are never included in frontend code or `VITE_` variables.
- Row Level Security is enabled on every exposed user-data table.
- Every read/write policy restricts rows to the authenticated owner.
- Client-supplied user IDs and metadata are treated as untrusted.
- Original resume files use a private Supabase Storage bucket with owner-scoped policies.
- Resume file type, size and ownership are validated before storage or download.
- Cross-account access attempts are tested before launch.

No password, access token, resume text or private file should be intentionally logged.

The legacy separately hosted API is no longer part of the architecture.
