# Performance Guide

CareerUpAI uses animation and rich UI, so performance should be considered while features are added.

## Frontend

- Avoid unnecessary re-renders in large interactive sections.
- Lazy-load heavy routes or visual modules when practical.
- Optimize large images and avoid shipping unused assets.
- Prefer CSS effects over expensive JavaScript animation when the result is equivalent.
- Keep scroll and pointer interactions lightweight.

## Backend

- Avoid repeated database queries for the same request.
- Add indexes only for proven query patterns.
- Return only the data the client needs.
- Paginate collections that may grow substantially.

## Measurement

Profile before optimizing. Compare loading, interaction and build size before and after significant visual or architectural changes.
