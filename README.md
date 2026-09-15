# CareerUpAI

CareerUpAI is an AI-focused career platform designed to bring career planning, resume intelligence, guided workflows, and a modern user experience into one product.

## Project status

**Active development.** The repository currently contains a React/Vite frontend and a Node.js backend foundation.

## What is in the project

### Career experience

- Career intelligence workspace
- Resume intelligence tools
- Dashboard-based user experience
- Public product pages
- Authentication and local demo flows
- Guided career workflows

### Interface

- Responsive React application
- Modern landing experience
- 3D/WebGL-oriented visual experiments
- Separate public and workspace experiences
- Reusable dashboard sections

## Tech stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- JavaScript / JSX

### Backend foundation

- Node.js
- Express
- MongoDB / Mongoose
- CORS

## Repository structure

```text
CareerUpAI/
├── frontend/        React/Vite client application
├── backend/         Backend application code
├── package.json     Backend/root package configuration
├── netlify.toml     Deployment configuration
└── README.md        Project overview
```

The frontend contains the public pages, dashboards, career intelligence, resume intelligence, demo workspace, and visual experience components.

## Run locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

To create a production frontend build:

```bash
npm run build
```

### Backend

Install the backend dependencies from the repository root or the backend workspace used by the current implementation, then run the configured development/start script.

```bash
npm install
npm run dev
```

## Development direction

The project is being developed toward a complete career platform rather than a collection of disconnected tools. New features should fit into one of four clear areas:

1. **Discover** — understand career paths and opportunities.
2. **Prepare** — improve resumes, skills, and professional readiness.
3. **Act** — turn recommendations into concrete next steps.
4. **Track** — keep progress and career activity in one workspace.

## Documentation rule

Keep user-facing product information in this README concise. Put implementation details beside the relevant frontend or backend code so the repository remains easy to scan.
