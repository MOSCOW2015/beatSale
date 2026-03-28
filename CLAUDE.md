# CLAUDE.md
- Never run "npm run dev"
- Use "npm run build" to check if code compiles or not. See results and fix code if it's need.
- Respond concisely
- Be minimal
- No explanations unless asked
- Do not repeat previously generated code unless modified.
- This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run build      # Production build to /dist
npm run preview    # Preview production build locally
```

No test runner or linter is configured.

## Architecture

**Beat Market** is a frontend-only SPA (no backend) built with Vue 3 + Vite. All data persists in `localStorage`.

### Tech Stack
- **Vue 3** (Composition API) + **Vue Router 4** + **Pinia**
- **Tailwind CSS** + **DaisyUI** for styling
- **Vite** as bundler

### Data Layer — localStorage only

All state lives in the browser. Keys:
- `beatstars_auth` — current session user
- `beatstars_users` — registered user accounts
- `beatstars_cart` — cart items
- `beatstars_goods` — product catalog (seeded with 6 items on first load)

### State Management

| Layer | File | Responsibility |
|---|---|---|
| Composable | `src/composables/useGoods.js` | Product CRUD; singleton pattern via module-level `_goodsRef` so state is shared across all callers |
| Store | `src/stores/auth.js` | Auth state; hardcoded admin (`admin@beatstars.com` / `admin123`); regular users stored in localStorage |
| Store | `src/stores/cart.js` | Cart state synced to localStorage |

### Routing & Guards

`src/router/index.js` defines all routes and a global `beforeEach` guard that:
- Redirects authenticated users away from `/login` and `/register`
- Blocks non-admin users from `/admin/**` routes

### View Structure

- `src/views/` — page components
  - `HomeView.vue` — product listing with filters
  - `goods/ProductView.vue` — product detail with nested tab routes (Overview, Details, Seller)
  - `admin/` — admin CRUD pages (DashboardView, Add/Edit/List goods)
- `src/components/` — Header, Footer (shared layout)
- `App.vue` — root 

layout wrapper with `<RouterView>`

## MANDATORY TOR (Task 2 — squeeze) 
- Client only (localStorage + Pinia)
- Pages: • list of products detailed product page (/goods/:id) + at least 3 nested routes • Admin panel (nested routes: list + add)
- Minimum of 4 products by default (seed)
- Product editing — separate route with :id, fields are filled in - Add /edit — admin only 
- Header + Footer on all pages - Role switching in the header (guest admin) — button/toggle 
- Protection of admin routes: beforeEach + meta.requiresAdmin 
- Form validation: required fields, numbers, errors under fields 
- Stylized page 404 
- Composables: useGoods.js (CRUD + localStorage sync)