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
├── App.jsx                    Main application composition
├── CareerIntelligence.jsx     Career intelligence experience
├── ResumeIntelligence.jsx     Resume-focused intelligence experience
├── Dashboard/                 Workspace/dashboard modules
├── PublicPages.jsx            Public-facing product pages
├── Home3D.jsx                 3D-oriented home experience
├── WebGLExperience.jsx        WebGL visual experience
├── LocalDemoWorkspace.jsx     Local demo workspace
├── LocalDemoIntelligence.jsx  Demo intelligence flow
└── auth/                      Authentication-related UI and logic
```

## Contribution rule

Keep page-level experiences easy to find and avoid moving unrelated product logic into the main `App.jsx`. New features should live close to the product area they belong to and be wired into the app from there.

For the overall product overview and backend context, see the repository-level [`README.md`](../README.md).
