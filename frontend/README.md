# CareerUpAI Frontend

This directory contains the React/Vite client for CareerUpAI.

## Responsibilities

The frontend owns the user-facing career experience, including:

- Public product pages
- Authentication and demo flows
- Career intelligence screens
- Resume intelligence screens
- Dashboard/workspace views
- 3D and WebGL-oriented visual experiences

## Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- JavaScript / JSX

## Run locally

From this directory:

```bash
npm install
npm run dev
```

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Source guide

```text
src/
├── App2.jsx                   Active routes and workspace guards
├── workspace/                 Compact shell, home, modules and shared styles
├── PublicPages.jsx            Public product pages
├── Home3D.jsx                 Public home experience
├── WebGLExperience.jsx        Public visual experience
├── demoIntelligence.js        Clearly marked local sample reports
└── auth/                      Authentication, onboarding and session logic
```

The workspace keeps the existing resume and career API calls. Jobs has a browser-local
application tracker; live job discovery is not connected yet. Interview practice uses
fixed questions and does not claim AI scoring. Local demo reports are illustrative.
Legacy page components remain in the repository while the active UI is served from
`workspace/` through `App2.jsx`.

## Contribution rule

Keep page-level experiences easy to find and avoid moving unrelated product logic into the main `App.jsx`. New features should live close to the product area they belong to and be wired into the app from there.

For the overall product overview and backend context, see the repository-level [`README.md`](../README.md).
