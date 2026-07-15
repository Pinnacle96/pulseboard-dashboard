# PulseBoard Dashboard

This is my submission for the responsive dashboard case study.

The app has a mocked auth flow, protected dashboard pages, charts, a searchable
customer table, profile editing, and light/dark mode. I used JSONPlaceholder for
the API data and shaped it into the dashboard metrics, chart data, and table
records.

## Stack

- React + TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- TanStack Table
- React Hook Form + Zod
- Recharts
- Tailwind CSS
- Vitest

## Running the App

```bash
npm install
npm run dev
```

Vite will print the local URL in the terminal. It is usually:

```txt
http://localhost:5173/
```

You can sign in with:

```txt
Email: maya@example.com
Password: password123
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
```

## What is Included

- Login page with validation
- Registration page with validation
- Protected routes
- Logout
- Responsive sidebar navigation
- Desktop topbar
- Mobile hamburger menu
- Dashboard summary cards
- Line chart and pie chart
- Sortable and filterable customer table
- Loading skeletons
- Error and empty states
- Profile view and edit form
- Light/dark mode
- Basic accessibility improvements like labels, focus states, skip link, and
  keyboard support

## Data

The app fetches from JSONPlaceholder:

- `/users`
- `/posts`

The response is converted into:

- dashboard metrics
- monthly revenue data
- plan distribution data
- customer activity rows
- profile data

Auth is mocked with localStorage, as suggested in the brief.

## Project Structure

```txt
src/
  app/
  components/
  features/
    auth/
    dashboard/
    profile/
    theme/
  lib/
  routes/
  types/
```

Most code is grouped by feature so the app is easier to follow.

## Checks

These commands pass:

```bash
npm run build
npm run test -- --run
npm run lint
```

Lint currently finishes with warnings only. The warnings are from TanStack Table
and the route file export shape for Fast Refresh.
