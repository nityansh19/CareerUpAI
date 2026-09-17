# Testing Strategy

CareerUpAI should be tested at the level where regressions are most likely to matter to users.

## Minimum checks

- Landing page renders without console errors.
- Navigation reaches the expected routes.
- Authentication-related UI states behave consistently.
- Forms reject invalid input and preserve useful feedback.
- API failures produce visible error states instead of silent failure.
- Responsive layouts remain usable on mobile widths.

## Backend checks

Verify success, validation failure, missing-resource and server-error paths for important endpoints. Database tests should use disposable test data.

## Before release

Run lint/build commands, test the main user journey manually, and verify that environment-dependent features fail safely when configuration is missing.
