# Bitácora del proyecto

Registro vivo de decisiones, mejoras y estado de avance de la web de Cosmos Trak. `CLAUDE.md` documenta la arquitectura (qué es el código); este archivo documenta el proceso (qué fuimos haciendo y por qué). No duplica `CHANGELOG.md` (eso lo genera `release-please` automáticamente desde los commits) — acá va el contexto que un mensaje de commit no cuenta: decisiones, pendientes, estado en el que quedó todo.

## Qué es el proyecto

Sitio institucional de Cosmos Trak, empresa de monitoreo satelital y rastreo GPS en Paraguay. Frontend estático (HTML/CSS/jQuery, sin build) servido por un backend Express que además procesa los formularios de contacto y cotización. Detalle técnico completo en `CLAUDE.md`.

## Hosting

Todo corre en **Hostinger**, en dos despliegues separados: el backend (Node.js App con auto-deploy por Git) y el frontend (estático en `public_html`, hasta ahora subido a mano). Base de datos MySQL y SMTP también viven en Hostinger. Detalle completo en `CLAUDE.md`.

## Filosofía de desarrollo

Gentle AI + Ponytail + Clean Code, reglas completas en `CLAUDE.md`. En corto: minimalismo real (YAGNI), cero abstracciones especulativas, código que se explica solo, enseñar el porqué de cada decisión no trivial.

## Flujo de Git

Nunca se commitea directo a `main`. Toda tarea va en su propia rama (`feat/`, `fix/`, `docs/`, `chore/`...) y el merge a `main` lo hace Marthin manualmente vía PR. `release-please` corta el release desde ahí.

## Estado actual

- **2026-08-14** — Se creó `CLAUDE.md` (arquitectura) y esta bitácora, en castellano. Se eliminó el viejo `.claude/CLAUDE.md` y `.claude/commands/review.md` (decisión intencional de Marthin al correr `/init`, quería un `CLAUDE.md` nuevo de cero) — la filosofía Gentle AI + Ponytail + Clean Code que tenían quedó consolidada directamente en `CLAUDE.md`, ya no vive en un archivo separado. Se detectó un bug real: `backend/package.json` quedó en `1.4.0` pero el sitio ya llevaba `1.10.0` publicado (`CHANGELOG.md`), porque `release-please` no tiene manifest y no toca ese archivo — el footer (`/api/version`) mostraba la versión vieja en producción. Se resolvió con bump manual a `1.10.0` en rama aparte (`fix/sincronizar-version-backend`, pendiente de merge). Causa raíz sin resolver todavía: sin manifest, va a desincronizarse de nuevo en el próximo release si no se recuerda bumpear a mano.

- **2026-08-14** — Se detectó por qué el frontend no se actualizaba solo en Hostinger: el backend tiene su propio auto-deploy por Git (Node.js App de Hostinger), pero el dominio público sirve el frontend como sitio estático aparte desde `public_html` — son dos despliegues independientes, no uno. Se agregó `.github/workflows/deploy-frontend.yml`: sube `frontend/` por FTPS a Hostinger en cada push a `main` que toque esa carpeta. **Pendiente**: cargar los secrets `HOSTINGER_FTP_SERVER`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD` y `HOSTINGER_FTP_SERVER_DIR` en GitHub (Settings → Secrets and variables → Actions) para que el workflow funcione — sin eso el deploy va a fallar.

## Pendientes / próximos pasos

- [ ] Configurar `release-please-config.json` + manifest para que `backend/package.json` se mantenga sincronizado solo (evita repetir el bump manual en cada release).
- [ ] Cargar los 4 secrets de FTP de Hostinger en GitHub para que `deploy-frontend.yml` funcione (ver arriba).
