# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Institutional website for Cosmos Trak (GPS/fleet tracking company, Paraguay). Static, framework-free frontend served by a small Express backend that also handles the contact/quote forms.

## Commands

All commands run from `backend/` (there is no root `package.json`):

```bash
cd backend
npm install
npm start        # node index.js
npm run dev       # node --watch index.js (auto-restart)
```

- No test suite exists — `npm test` is an unconfigured stub that exits with an error.
- No lint/format tooling is configured.
- Local DB: run `backend/models/schema.sql` against MySQL to create the `contactos` table.
- Required env vars (`backend/.env`, gitignored): `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`/`DB_SSL_REJECT_UNAUTHORIZED` (optional), `DB_CONNECTION_LIMIT` (optional), `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `WHATSAPP_PHONE_ADMIN`, `WHATSAPP_APIKEY_ADMIN`, `WHATSAPP_PHONE_CLIENT`/`WHATSAPP_APIKEY_CLIENT` (optional, second notification recipient).

## Architecture

**Two folders, one server.** `backend/index.js` is the only entry point: it mounts the API routes, then serves `frontend/` as static files, then falls back to `frontend/index.html` for any non-`/api` path (clean-URL routing, not an SPA — the frontend has no client-side router).

**Frontend (`frontend/`)** — plain HTML5/CSS3 + jQuery, no build step, no framework. Three pages: `index.html`, `flotas.html`, `particulares.html`, sharing `assets/{css,js,img,fonts}`.

**Backend (`backend/`)** — Express 5, layered `routes/ → controllers/ → models/ → config/`:
- `config/db.js` — MySQL2 pool (`db.query()` wraps `pool.execute()` and returns `rows`, emulating the old Postgres-style call site).
- `config/mailer.js` — Nodemailer via Hostinger SMTP (host/user are hardcoded, only the password comes from env).
- `config/whatsapp.js` — CallMeBot API notifications (free tier; recipients must have opted in via WhatsApp beforehand).
- `models/contacto.js` — single `Contacto.create()` insert into the `contactos` table.
- `controllers/formController.js` — the only real business logic in the backend.
- `routes/formRoutes.js` → `POST /api/form/submit`; `routes/systemRoutes.js` → `GET /api/version` (reads `package.json`, no DB).

**Form submission flow** (the core thing to understand before touching forms):
1. `frontend/assets/js/form-handler.js` intercepts submits from `#contactForm` and any `.courses-form`/`#installForm`, builds a JSON payload (`tipo_formulario` is `'contacto'` or `'cotizacion'`), POSTs to `/api/form/submit`.
2. `formController.submitForm` validates `telefono` against `TELEFONO_REGEX = /^0\d{9}$/` first, before touching the DB — this is the single source of truth for phone validation, don't re-validate elsewhere.
3. Saves to MySQL via `Contacto.create`.
4. Always sends a notification email (failure here is logged but does **not** fail the request — the contact is already saved).
5. Sends a WhatsApp notification via CallMeBot **only when `tipo_formulario === 'cotizacion'`** (quote requests, not general contact messages) — also non-blocking on failure.

**Versioning**: `release-please` (GitHub Action, Conventional Commits) tracks the release version via git tags and `CHANGELOG.md` only — there is no `release-please-config.json`/manifest, so it does **not** touch `backend/package.json`. `GET /api/version` reads `backend/package.json`'s version, and `frontend/assets/js/version-handler.js` renders it in the footer (`#app-version`). Because nothing syncs the two, `backend/package.json` drifts from the real released version over time (currently `1.4.0` in the file vs. `1.10.0` released) — bump it manually alongside releases, or wire release-please to manage it via a manifest, until this is fixed for good.

## CI

- `.github/workflows/devsecops.yml` — on push/PR to `main`: Gitleaks secret scan, then `npm audit --audit-level=high` in `backend/`.
- `.github/workflows/release-please.yml` — automates version bumps/releases from Conventional Commits on `main`.

## Hosting

Everything runs on **Hostinger**: the MySQL database, the SMTP relay (`smtp.hostinger.com`, hardcoded in `config/mailer.js`), and the Node app itself. No separate CDN, build pipeline, or deploy workflow lives in this repo — deployment is manual against the Hostinger environment.

## Development Philosophy

This project follows Gentle AI (teach through implementation, no unexplained magic) + Ponytail (ruthless minimalism, YAGNI, no speculative abstraction) + Clean Code. The full rules live in `.claude/CLAUDE.md` — read it before making non-trivial changes; this file won't repeat it.

## Git Workflow

Never commit directly to `main`. Every change goes on its own branch (`feat/`, `fix/`, `docs/`, `chore/`, `ci/` — matches existing history) and gets merged by Marthin via PR, same as every branch already in this repo. `release-please` then cuts the release off `main`.

## Project log

Ongoing progress, decisions, and "where we left off" live in `BITACORA.md` at the repo root — check it before starting a session, update it before ending one. This file stays a static architecture reference; it doesn't grow with day-to-day notes.
