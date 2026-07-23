# Lee's Korean Restaurant — Website

A website for Lee's Korean Restaurant (Louisville, KY): public menu/story/hours pages plus a simple admin dashboard for managing menu items and prices.

## Stack

| Layer      | Tech                                      |
| ---------- | ----------------------------------------- |
| Frontend   | React + Vite                              |
| Backend    | FastAPI (Python 3.12)                     |
| Database   | PostgreSQL 16                             |
| Containers | Docker + Docker Compose                   |
| CI         | GitHub Actions (lint + build on every PR) |

## Project structure

```
.
├── frontend/          # React + Vite app (localhost:3000)
├── backend/           # FastAPI app (localhost:8000)
├── docker-compose.yml
├── .env.example       # copy to .env before running
└── .github/workflows/ci.yml
```

## Getting started

1. Copy the env template and adjust if needed (defaults work fine for local dev):
   ```bash
   cp .env.example .env
   ```
2. Start everything:
   ```bash
   docker-compose up
   ```
   The backend automatically runs database migrations on startup before serving requests.
3. Create your first admin account (needed to log into the admin API/dashboard):
   ```bash
   docker-compose exec backend python -m app.scripts.create_admin owner@leeskorean.com
   ```
4. Visit:
   - Frontend: http://localhost:3000
   - Backend docs (Swagger UI): http://localhost:8000/docs
   - Health check: http://localhost:8000/health

The frontend placeholder page pings `/api/health` on load — if you see "Backend connected," the whole stack (frontend → backend → Postgres) is wired correctly.

## Public site

- `/` — Home: hero, family story teaser, a curated selection of "featured" menu items (with real photos), visit CTA
- `/menu` — the full menu, grouped by category, text-only (name, description, price - no photos). Spicy dishes are marked with 🌶️ right next to the name, matching how the printed menu does it.
- `/about` — the Lee family (1980) → An family (2001) story
- `/location` — address, embedded map, phone, full weekly hours

All pages are driven by real API data (menu, hours, closure banner).

**Photos only matter for featured items.** The full `/menu` page is intentionally text-only - no photos, just title/description/price, styled as an ornate list (red category banners, dotted price leaders) rather than photo cards. The admin decides which handful of items to feature on the homepage (`is_featured` on each item), and only those get a real photo; everything else just shows a placeholder in the admin panel until/unless it's ever featured. See `frontend/public/images/README.md` for the placeholder shot list for the _page_ photos (hero, family portraits, etc.) that are separate from menu item photos.

**Note for deployment:** uploaded images are served by the backend at `/uploads/<file>`, separately from the `/api/*` JSON routes. The dev setup proxies both (see `vite.config.js`), but if you deploy the frontend and backend as genuinely separate services/domains in production, make sure whatever reverse-proxies `/api` to the backend also proxies `/uploads` the same way - otherwise uploaded photos will 404 even though the upload itself succeeds.

## Loading the real menu

The database starts empty. To load Lee's actual printed menu (92 items transcribed from the physical menu, across 10 categories):

```bash
docker-compose exec backend python -m app.scripts.seed_menu
```

This replaces any existing categories/items, so it's meant to be run once during setup (it prompts for confirmation; pass `--yes` to skip that). Spicy items are marked with a 🌶️ suffix on the name rather than the app's 1-6 spice_level scale, matching how the printed menu marks them. Six of the menu's own starred "recommended" dishes (Galbi, Bulgogi, Japchae, Bibimbap, Jambong, Kimchi-jji-gae) are featured by default so the homepage isn't empty right after seeding - change this pick anytime via the "Feature on homepage" checkbox in the admin panel. None of the featured items have a photo yet - upload those separately once featured.

## Admin login (frontend)

Visit http://localhost:3000/admin — you'll be redirected to `/admin/login` if you're not signed in. Log in with the email/password you set via `create_admin` above. The session token is stored in the browser and validated against `/auth/me` on every page load, so refreshing keeps you logged in until the token expires (24 hours by default — see `ACCESS_TOKEN_EXPIRE_MINUTES` in `app/config.py`).

Once logged in, two tabs:

- **Menu** — add/rename/reorder/delete categories; add/edit/delete items within them, including price, Korean name, description, a "Spicy 🌶️" checkbox (appends the emoji to the name, same as the printed menu), an available/hidden toggle, and a "Feature on homepage" toggle - photo upload only appears once an item is featured, since the full menu page itself never shows photos
- **Hours & Info** — phone, address, a full weekly hours editor (supports split lunch/dinner slots per day, or none for a closed day), and a closure banner toggle that shows a message across the top of the public site

## API overview

**Public (no auth):**

- `GET /health` — liveness + DB connectivity
- `GET /menu` — menu grouped by category; only shows available items
- `GET /restaurant-info` — hours, phone, address, closure banner

**Auth:**

- `POST /auth/login` — `{ "email": "...", "password": "..." }` → `{ "access_token": "..." }`. Send this token as `Authorization: Bearer <token>` on all `/admin/*` routes below.
- `GET /auth/me` — returns the logged-in admin's info; used by the frontend to validate a stored token

**Admin (requires bearer token):**

- `GET/POST /admin/categories`, `PATCH/DELETE /admin/categories/{id}` — includes unavailable items, unlike the public `/menu`
- `POST /admin/menu-items`, `PATCH/DELETE /admin/menu-items/{id}`
- `PATCH /admin/restaurant-info`
- `POST /admin/uploads/image` — multipart image upload (JPEG/PNG/WEBP, 5MB max), returns `{ "url": "/uploads/<file>" }` to use as an item's `image_url`

There is no signup route by design — admin accounts are created with the CLI script above, not through the website.

## Database migrations

Migrations are managed with Alembic and run automatically when the backend container starts. To create a new migration after changing `app/models.py`:

```bash
cd backend
alembic revision --autogenerate -m "describe the change"
```

Review the generated file in `alembic/versions/` before committing — autogenerate is a starting point, not always exactly right.

## Running services individually (without Docker)

**Backend:**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Linting, formatting & tests

```bash
# Frontend
cd frontend && npm run lint && npm run format:check

# Backend
cd backend && ruff check . && black --check . && pytest
```

All of this runs automatically in CI on every pull request against `main`.

## Status

- [x] Phase 0 — Project foundation
- [x] Phase 1 — Data model & backend API (menu, categories, restaurant info, auth)
- [x] Phase 2 — Admin frontend auth (login page, protected admin routes in the UI)
- [x] Phase 3 — Public site (Home, Menu, About, Location/Contact)
- [x] Phase 4 — Admin dashboard (menu + hours editor UI)
- [x] Phase 5 — Design polish (Korean-traditional-modern theme)
- [ ] Phase 6 — Deploy (Railway)
