# CareerUpAI Release Checklist

Use this checklist before publishing a significant update.

## Product

- Confirm the main landing experience communicates the product clearly.
- Verify login, dashboard navigation, and career-tool entry points.
- Check empty, loading, error, and success states.
- Remove unfinished labels or placeholder copy that should not ship.

## Frontend

- Run linting and a production build.
- Test desktop and mobile layouts.
- Check keyboard focus and obvious accessibility regressions.
- Verify animations remain smooth and do not block interaction.

## Backend

- Confirm required environment variables are documented.
- Verify API errors return useful status codes/messages.
- Check database operations fail safely.
- Confirm no secrets or local configuration files are committed.

## Final review

- Read the README as a new visitor.
- Check broken links and outdated screenshots/copy.
- Review the diff for accidental debug code.
- Use a release-focused commit message and note important behavior changes.
