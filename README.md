# PulseBoard - Responsive Dashboard Application

PulseBoard is a production-quality responsive dashboard built for the Frontend
Engineer skill verification case study. It includes mocked authentication,
protected routes, API-backed dashboard data, interactive charts, sortable and
filterable tables, profile editing, accessibility refinements, and a persistent
light/dark mode.

## Features

- Login and registration pages with client-side validation
- Mocked authentication with localStorage session persistence
- Protected application routes with redirect handling
- Responsive sidebar navigation with active route highlighting
- Desktop topbar with page context, search affordance, theme toggle, and profile
  summary
- Mobile hamburger menu with keyboard-friendly close behavior
- Dashboard metric cards for key business indicators
- Responsive line and pie charts powered by API-derived data
- Customer activity table with sorting, filtering, empty state, and horizontal
  overflow handling
- Loading skeletons, retryable error states, and friendly empty states
- User profile display and edit flow with validation
- Persistent light/dark mode that respects system preference on first load
- Skip link, visible focus states, ARIA labels, and route focus management

## Tech Stack

- **React + TypeScript + Vite** for a modern, typed frontend foundation
- **React Router** for routing, protected pages, and lazy-loaded routes
- **TanStack Query** for API fetching, caching, loading states, and error states
- **Zustand** for authentication and theme state
- **React Hook Form + Zod** for form state and validation
- **Recharts** for responsive dashboard visualizations
- **TanStack Table** for sorting and filtering table data
- **Tailwind CSS** for mobile-first styling and consistent design tokens
- **Vitest** for focused unit testing

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app runs locally at the URL printed by Vite, usually:

```txt
http://localhost:5173/
```

Demo login:

```txt
Email: maya@example.com
Password: password123
```

## Available Scripts

```bash
npm run dev      # Start the local development server
npm run build    # Type-check and build production assets
npm run lint     # Run ESLint
npm run test     # Run unit tests
```

## API and Data

Dashboard data is fetched from
[JSONPlaceholder](https://jsonplaceholder.typicode.com/) and transformed into:

- 4 summary metrics
- 12 monthly chart data points
- Plan distribution data for the pie chart
- 30 customer activity records for the sortable/filterable table

The profile page also uses API-shaped user data, while edits are persisted into
the mocked authenticated session.

## Architecture Notes

- Authentication state is isolated in `src/features/auth/authStore.ts`.
- Theme state is isolated in `src/features/theme/themeStore.ts`.
- API access and data transformation live in `src/lib/api.ts`.
- Dashboard, profile, and auth code are grouped by feature.
- Shared UI primitives live in `src/components/ui`.
- Dashboard and profile routes are lazy-loaded to keep the initial route lighter.

## Accessibility

The application includes semantic landmarks, form labels, ARIA labels where
needed, keyboard-accessible controls, visible focus states, a skip link, route
focus management, and Escape-key support for closing the mobile menu.

## Verification

The following checks pass:

```bash
npm run build
npm run test -- --run
npm run lint
```

`npm run lint` currently completes with warnings only. The warnings are related
to TanStack Table's React Compiler compatibility notice and a Fast Refresh
warning for the route module export shape.

## Submission Flow

This implementation should be submitted from the feature branch:

```bash
git push -u origin feature/responsive-dashboard
```

Then open a Pull Request from:

```txt
feature/responsive-dashboard -> main
```
