# Cloud deployment

The active frontend now uses authenticated cloud accounts. The backend stores
profiles, job tracking, interview practice, reports and PDFs in MongoDB. No cloud
service has been created by these code changes; finish the setup below before
merging this branch into the frontend's production branch.

## Create the database in MongoDB Atlas

1. Create an Atlas account and a cluster in your preferred nearby region. Review
   the displayed plan and any billing terms before creating it.
2. Create a database user with read/write access to the `careerforge` database.
   This is a database credential, separate from your Atlas login.
3. In Connect > Drivers, copy the MongoDB connection string. Include
   `/careerforge` before its query string and URL-encode special characters in
   the database password. Keep this URI private.
4. In Network Access, allow the outbound IP ranges shown by the Render service
   once it is created. A laptop's IP address will not permit the Render server.

## Create the backend in Render

1. Create a Render account and connect the GitHub repository.
2. Create a Blueprint using `render.yaml` from this change's branch. It configures
   the backend directory, locked dependency installation, Node 24, a free service,
   manual deployments and `/health` checks. Review the current plan in Render.
3. Enter `MONGODB_URI` privately in Render when prompted. Keep
   `FRONTEND_URL=https://careerupai.netlify.app` and `NODE_ENV=production`.
4. Copy the actual HTTPS service origin assigned by Render. Do not guess it from
   the service name. Configure Atlas network access with Render's outbound ranges
   and redeploy if the initial database connection was refused.
5. Visit `<backend-origin>/health`. It must return HTTP 200 with
   `{"status":"ok","database":"connected"}`. Startup fails if MONGODB_URI is absent
   or MongoDB is unreachable. Free compute may sleep when inactive and take time
   to respond again; consult Render's current free-service limits.

## Connect Netlify

1. In the existing site's environment variables, set `VITE_API_URL` to the actual
   backend HTTPS origin, with no `/api` suffix. This is public configuration;
   never put MongoDB credentials in any `VITE_` variable.
2. Preview this branch with the variable configured, verify the flows below, then
   merge and rebuild the production frontend. To test a Netlify deploy preview,
   add its actual origin to Render's FRONTEND_URL as a comma-separated second
   value alongside https://careerupai.netlify.app, then redeploy the backend.
   Remove the preview origin after verification. A build fails if the address is
   missing, uses HTTP, points to localhost or includes an API path.
3. Frontend API calls now use `/api/account`. The previous unauthenticated
   `/api/users` and `/api/resume-analysis` routes deliberately return HTTP 410.

## Existing accounts and data

Old browser-only accounts are not cloud accounts. Create a cloud account before
signing in on other devices. Original localStorage and IndexedDB data are preserved
on their original device and are not silently uploaded. This release does not
include an automated importer, password reset or email verification.

The backend uses separate `cloudaccounts` and `cloudsessions` collections. It does
not activate the legacy plaintext-password collection. Before migrating existing
MongoDB data, back it up, inspect the source and destination, and define the account
mapping and password migration. No source database was accessed or changed here.

## Persistence and limits

Each account has one current PDF stored as MongoDB binary data, limited to 5 MB.
Uploading replaces that account's previous cloud PDF. Analysis accepts up to 10
pages and uses rule-based checks against the PDF text. Career recommendations are
also rule-based; no external AI model is configured. Jobs are limited to 500 per
account. Monitor database capacity as uploads grow.

Reload or sign in again to load another device's updates. This is shared durable
storage, not live collaborative editing. Revision checks reject conflicting writes.
Wait for interview practice to report `Saved online` before leaving its page. A
failed save stays visible as an error. Retry after restoring connectivity; reload
first if the app reports a conflict or an uncertain network result.

Passwords use salted scrypt hashes. Random bearer sessions expire after seven days;
only their hashes are stored in MongoDB. Logout revokes the current session when
the backend is reachable and clears the local token in all cases. Offline logout
cannot revoke a server session until expiry. Tokens are kept in browser storage;
keep frontend dependencies and XSS protections maintained. The initial in-memory
login/upload limiter is for one backend instance; distributed hosting requires a
shared limiter. No password or database credentials belong in source control.

## Local development and regression checks

Install dependencies separately with `npm ci` in backend and frontend. The server
reads environment variables from its host. With a local backend `.env` file, use
`node --env-file=.env server.js`; `npm start` does not load `.env` automatically.
For local MongoDB set NODE_ENV=development and FRONTEND_URL=http://localhost:5173.
The Vite development server defaults to http://localhost:5000 when VITE_API_URL is
unset. Production requires the configured HTTPS origin.

Run `node --test backend/test/cloud.test.js` from the repository root with
TEST_MONGODB_URI pointing to a disposable local database named
`careerup_cloud_test` (for example, one created by mongodb-memory-server). The
suite starts its own backend on port 15050 (override using TEST_PORT), adds test
accounts to that database and shuts down the child backend. It never uses Atlas
or deletes an existing database. Only use disposable test data.

The integration suite covers password hashes, duplicate email rejection, separate
device sessions, profile/jobs/practice persistence, unauthorized access, stale
writes, CORS, actual PDF parsing/downloads, backend restart, logout and expiry.

## Live acceptance checks

- Register and log in from two independent browsers with the same account.
- Save a profile and job on one device; reload the second and verify them.
- Save interview notes; verify them on the other device.
- Upload and analyze a PDF; download the same file from the other device.
- Restart the hosted backend and confirm data and login sessions persist.
- Turn the development laptop off and repeat the main flows from a phone.

References: [Render Blueprints](https://render.com/docs/blueprint-spec),
[Render web services](https://render.com/docs/web-services),
[Render free services](https://render.com/docs/free),
[Atlas network access](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

