# Bitácora del proyecto

Registro vivo de decisiones, mejoras y estado de avance de la web de Cosmos Trak. `CLAUDE.md` documenta la arquitectura (qué es el código); este archivo documenta el proceso (qué fuimos haciendo y por qué). No duplica `CHANGELOG.md` (eso lo genera `release-please` automáticamente desde los commits) — acá va el contexto que un mensaje de commit no cuenta: decisiones, pendientes, estado en el que quedó todo.

## Qué es el proyecto

Sitio institucional de Cosmos Trak, empresa de monitoreo satelital y rastreo GPS en Paraguay. Frontend estático (HTML/CSS/jQuery, sin build) servido por un backend Express que además procesa los formularios de contacto y cotización. Detalle técnico completo en `CLAUDE.md`.

## Hosting

Todo corre en **Hostinger**: base de datos MySQL, SMTP (`smtp.hostinger.com`) y el propio backend Node. Sin CDN ni pipeline de deploy propio en este repo — el deploy es manual contra el entorno de Hostinger.

## Filosofía de desarrollo

Gentle AI + Ponytail + Clean Code, reglas completas en `.claude/CLAUDE.md`. En corto: minimalismo real (YAGNI), cero abstracciones especulativas, código que se explica solo, enseñar el porqué de cada decisión no trivial.

## Flujo de Git

Nunca se commitea directo a `main`. Toda tarea va en su propia rama (`feat/`, `fix/`, `docs/`, `chore/`...) y el merge a `main` lo hace Marthin manualmente vía PR. `release-please` corta el release desde ahí.

## Estado actual

- **2026-08-14** — Se creó `CLAUDE.md` (arquitectura) y esta bitácora. Se detectó un bug real: `backend/package.json` quedó en `1.4.0` pero el sitio ya llevaba `1.10.0` publicado (`CHANGELOG.md`), porque `release-please` no tiene manifest y no toca ese archivo — el footer (`/api/version`) mostraba la versión vieja en producción. Se resolvió con bump manual a `1.10.0` en rama aparte (`fix/sincronizar-version-backend`, pendiente de merge). Causa raíz sin resolver todavía: sin manifest, va a desincronizarse de nuevo en el próximo release si no se recuerda bumpear a mano.

## Pendientes / próximos pasos

- [ ] Configurar `release-please-config.json` + manifest para que `backend/package.json` se mantenga sincronizado solo (evita repetir el bump manual en cada release).
