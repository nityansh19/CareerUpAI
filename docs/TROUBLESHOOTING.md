# Troubleshooting

Use this guide for common local-development problems before changing project code.

## Frontend does not start

- Confirm dependencies are installed in `frontend/`.
- Check the Node version and package manager output.
- Remove stale build artifacts only after reading the actual error.

## Backend does not start

- Confirm backend dependencies are installed.
- Verify required environment variables and database connectivity.
- Check whether the configured port is already in use.

## API requests fail

- Confirm the frontend is pointing to the correct API origin.
- Check CORS configuration and browser network errors.
- Inspect server logs for validation or connection failures.

## Build succeeds locally but deployment fails

Compare Node versions, environment variables, case-sensitive file paths and build commands between local and hosted environments.
