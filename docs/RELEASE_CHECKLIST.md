# Release checks

## Device workspace release

- Regression tests, frontend lint, and production build pass.
- Public content describes rule-based reviews and device storage accurately.
- SPA deep links, responsive layouts, loading states, and keyboard controls work.
- New accounts start empty; sample data is explicitly labelled.
- Original PDFs and workspace backups can be downloaded separately.
- Review text, application notes, and interview drafts survive a reload.

## Online account activation

- Hosted API reports version 2 with MongoDB connected.
- `ALLOWED_ORIGINS` and `TRUST_PROXY` match production infrastructure.
- Verify real hosted account ownership, persistence, resume downloads, and logout.
- Configure `RESEND_API_KEY` and a verified `EMAIL_FROM` sender, then verify registration, code delivery, expired/wrong-code rejection, resend, and verified login.
- Decide and implement account recovery, retention, and deletion policy before a wider public online-account launch.
- Ensure `VITE_API_URL` points to the verified-account API; redeploy frontend after backend verification is working.
- Confirm device accounts stay available as a separate mode or document transfer instructions.

Payments, live job feeds, and generative AI are not enabled or advertised as functioning features in this release.
