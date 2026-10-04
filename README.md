# 🎸 Harder Rock Hotel

A hotel management dashboard for a fictional, rock-themed hotel. Hotel staff use it to run the front desk: manage cabins and bookings, check guests in and out, and track sales and occupancy.

**Try it:** the app ships in **demo mode**, so it runs entirely in the browser with no backend. Hit **"Enter as demo user"** on the login page.

## Features

- **Dashboard:** bookings, sales, check-ins and occupancy for the last 7/30/90 days; a sales chart (cabin vs. extras), a stay-length chart, and today's arrivals and departures with one-click check-in/out
- **Bookings:** search by guest, cabin or `#id`; filter by status; sort; paginate (all kept in the URL so views are shareable)
- **New booking:** returning or new guest, visual cabin picker, live price summary. Validates dates, house rules, cabin capacity and double-bookings
- **Booking details**, a **check-in flow** (optional breakfast add-on, payment confirmation) and a **printable invoice** (print or save as PDF)
- **Cabins:** create, edit, duplicate and delete, with photo upload. Cabins with active bookings are protected from deletion
- **Staff accounts**, **profile and avatar**, **password change**
- **Settings:** house rules (min/max nights, max guests, breakfast price) and one-click sample-data reset
- **Light / dark / system theme**, fully **responsive** (phone to widescreen), keyboard- and screen-reader-friendly

## Tech

| | |
|---|---|
| UI | React 19, React Router 8 (data router, route-level code splitting) |
| Styling | Tailwind CSS 4 with semantic design tokens (light + dark) |
| Server state | TanStack Query 5 (caching, prefetching, background refetch) |
| Forms | React Hook Form |
| Charts | Recharts 3 |
| Backend | Demo adapter (localStorage) **or** Firebase (Auth, Firestore, Storage) |
| Tooling | Vite 8, ESLint 10 (flat config + React Compiler-aware hooks rules) |

### Architecture

```
src/
  services/api.js        ← single data API used by the whole UI
  services/demo/         ← in-browser backend (localStorage, simulated latency)
  services/firebase/     ← Firebase backend, same function signatures
  services/shared.js     ← filtering, joins and booking validation shared by both
  data/                  ← sample cabins, guests and bookings + seed generator
  features/<area>/       ← TanStack Query hooks and feature components
  components/ui|layout/  ← design-system components
  pages/                 ← one lazy-loaded module per route
```

The backend is picked at build time, and its module is loaded lazily, so the Firebase SDK is only downloaded when it's actually used. Sample booking dates are relative to "today" and roll forward automatically, so the demo never goes stale.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run lint
```

### Using Firebase instead of demo mode

1. Create a Firebase project with **Authentication (email/password)**, **Firestore** and **Storage** enabled.
2. Copy `.env.example` to `.env.local` and fill in your web-app config, with `VITE_DATA_SOURCE=firebase`.
3. Deploy `firestore.rules` (signed-in staff can read/write).
4. Create your first user in the Firebase console, log in, then go to **Settings → Reset sample data** to seed Firestore.

## Deploying

`netlify.toml` is included (build command, publish directory and SPA redirect). Connect the repo on Netlify and it just works. For Firebase mode, add the `VITE_*` variables in Netlify's environment settings.

---

Built by [Lucien Gaydos](https://github.com/darkstrings). The hotel, guests and bookings are fictional.
