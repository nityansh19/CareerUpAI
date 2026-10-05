# Verification

Run from the repository root:

```bash
npm test --prefix frontend
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```

Frontend tests cover isolated device accounts, strict login behavior, empty initial profiles, skill aliases and evidence, scoring, learning plans, interview writing checks, backup validation, and safe CSV output.

Backend tests currently verify:

- the API starts without a legacy database connection,
- health reports the Supabase migration state,
- legacy hosted account routes are migration-gated,
- workspace validation still rejects unsafe or malformed input.

## Browser checks during migration

Verify public landing → sign-in page → explicit sample/device workspace → profile → career comparison → learning milestone → resume text review → application tracker → interview session → backup export.

Hosted account tests will be expanded when Supabase is connected. Before cloud activation, verify email confirmation, wrong-password rejection, session refresh/sign-out, RLS ownership isolation, profile/workspace persistence across devices, private resume upload/download, and unauthorized-row rejection.
