# Verification

Run from the repository root:

```bash
npm test --prefix frontend
npm test --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```

Frontend tests cover isolated device accounts, strict login, empty initial profiles, skill aliases and evidence, scoring, learning plans, interview writing checks, backup validation, and safe CSV output. Backend tests cover password hashing, ownership checks, validation, credential-free serialization, stale write rejection, and parsing a real PDF fixture.

API contract tests exercise the actual Express routes with explicitly mocked database model methods. They do not verify a live MongoDB connection, hosted persistence, or cross-device sync. The fixture contains synthetic data only.

Browser release journey: public landing → sign-in page → explicit sample workspace → profile → career comparison → learning milestone → resume text review → save/edit an opportunity → interview session → backup export. Also verify a fresh account's onboarding, two separate device accounts, PDF upload/download, reload persistence, mobile navigation, and quick actions.

Before online activation, independently verify registration, wrong-password rejection, reload/new-tab sign-in, record ownership rejection, profile and job persistence across devices, resume upload/download, stale update conflict, and session revocation against the deployed API with a disposable test account.
