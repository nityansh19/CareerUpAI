# Verification

Run from the repository root:

```bash
npm test --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
```

Frontend tests cover device accounts, empty initial profiles, skill aliases and evidence, scoring, learning plans, interview writing checks, backup validation, and safe CSV output.

## Browser checks during migration

Verify:

public landing → sign-in page → sample/device workspace → profile → career comparison → learning milestone → resume text review → application tracker → interview session → backup export.

## Supabase activation checks

When Supabase is connected, add verification for:

- email/password registration,
- email confirmation,
- wrong-password rejection,
- session refresh and sign-out,
- profile/workspace persistence across devices,
- Row Level Security ownership isolation,
- private resume upload/download,
- unauthorized-row rejection,
- password recovery,
- account deletion and data cleanup.
