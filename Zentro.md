# Zentro

> Web platform focused on university well-being that connects students through knowledge sharing, academic collaboration, and the organization of sports activities.

---

## Overview

Zentro is an application developed to strengthen the student community through collaborative learning spaces and sports activities organized by the students themselves.

The platform allows users to share knowledge, request academic support, create collaboration opportunities, publish events with images, and participate in sports activities outside conventional university hours.

The project was born as a solution to the lack of tools that integrate academic and sports well-being in a single digital environment, promoting peer interaction, collaborative learning, and a more active university life.

---

## Current Scope

### Features

* User registration and authentication.
* Student profile management and editing with photo support.
* Publication and visualization of academic exchange events with image uploads.
* Creation and exploration of sports activities with image uploads.
* Collaborative and individual project management with task assignment and progress tracking.
* Activity feed on the home page showing the latest academic and sports posts.
* Weekly session sidebar with real-time schedule overview.
* Calendar for scheduling and visualizing upcoming sessions.
* Global search across the platform.
* Smooth animations and transitions across all interactions.
* Responsive design for desktop and mobile.

### Status

> The repository is in an advanced MVP stage, with all main screens implemented, functional navigation, full Supabase integration, and a recent design and UX improvement sprint that introduced animations, image uploads, and a home feed.

---

## Architecture

### Responsibilities

* Manage user authentication and access control.
* Facilitate the publication and discovery of academic opportunities and events.
* Enable the creation and organization of sports activities.
* Support collaborative project workflows with task tracking and member progress.
* Centralize student interaction in a single platform.
* Maintain a responsive, accessible, and animated user experience.

### Integrations

* Firebase Authentication
* Supabase Database (PostgreSQL)
* Supabase Storage (event image uploads via `event-images` bucket)
* React Router DOM
* Vite Development Server
* Netlify (deployment with SPA redirect rules)

---

## Tech Stack

| Category | Technologies                          |
| -------- | ------------------------------------- |
| Core     | React, TypeScript, Vite               |
| Routing  | React Router DOM                      |
| Auth     | Firebase Authentication               |
| Backend  | Supabase (Database + Storage)         |
| Styling  | Custom CSS (modular per page/component) |
| State    | React Context API + Hooks             |
| Tooling  | ESLint, Git, GitHub                   |
| Deploy   | Netlify                               |

> See `package.json` for exact versions.

---

## Getting Started

### Prerequisites

* Node.js 20+
* npm

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

---

## Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Credentials must be obtained from the configured Supabase and Firebase projects.

---

## Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start development server           |
| `npm run build`   | Create production build            |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                         |

---

## Development Standards

* Component-based reusable architecture.
* TypeScript for static typing throughout the codebase.
* Conventional Commits for semantic version control.
* Separation of concerns by module (pages, components, services, context, styles).
* Collaborative development via Git and GitHub.

Example commits:

```text
feat: add image upload to academic and sports events
fix: correct ImagePicker import casing for Linux builds
refactor: move weekly sessions to sticky home sidebar
style: add smooth animations and sliding navbar pill
```

---

## Project Structure

```text
src/
├── components/        # Reusable UI components (Navbar, ImagePicker, etc.)
│   └── projects/      # Project-specific components
├── context/           # React Context providers (Auth, Academic, Sports, Sessions…)
├── layout/            # DashboardLayout, AuthLayout
├── pages/             # Route-level page components
├── services/          # Supabase + Firebase service functions
├── styles/            # Per-page and per-component CSS files
├── assets/            # Static assets
└── main.tsx           # Application entry point
```

---

## Documentation

Project documentation can be found under:

```text
docs/
├── benchmark.md
├── architecture.md
├── route-map.md
├── diagrams/
└── presentation/
```

---

## Deployment

The application is deployed on **Netlify**. A `_redirects` file is included in the `public/` folder to handle client-side routing:

```text
/*    /index.html   200
```

---

## Ownership

**Team:** Zentro Development Team

**Maintainers:**

* Juan Esteban Ospina
* Felipe González
* Juan Jose Correa

---

## Vision

Zentro aims to become a meeting point for the university community, where students can enhance their learning, share knowledge, and actively participate in sports and collaborative activities — strengthening overall well-being within the university.