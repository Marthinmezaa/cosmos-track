# Bitácora del proyecto

Registro vivo de decisiones, mejoras y estado de avance de la web de Cosmos Trak. `CLAUDE.md` documenta la arquitectura (qué es el código); este archivo documenta el proceso (qué fuimos haciendo y por qué). No duplica `CHANGELOG.md` (eso lo genera `release-please` automáticamente desde los commits) — acá va el contexto que un mensaje de commit no cuenta: decisiones, pendientes, estado en el que quedó todo.

## Qué es el proyecto

Sitio institucional de Cosmos Trak, empresa de monitoreo satelital y rastreo GPS en Paraguay. Frontend estático (HTML/CSS/jQuery, sin build) servido por un backend Express que además procesa los formularios de contacto y cotización. Detalle técnico completo en `CLAUDE.md`.

## Hosting

Todo corre en **Hostinger**, en dos despliegues separados y confirmados en hPanel: backend por Git (Node.js App, "Directorio root: backend") y frontend estático a mano en `public_html`. Base de datos MySQL y SMTP también viven en Hostinger. Detalle completo en `CLAUDE.md`.

## Filosofía de desarrollo

Gentle AI + Ponytail + Clean Code, reglas completas en `CLAUDE.md`. En corto: minimalismo real (YAGNI), cero abstracciones especulativas, código que se explica solo, enseñar el porqué de cada decisión no trivial.

## Flujo de Git

Nunca se commitea directo a `main`. Toda tarea va en su propia rama (`feat/`, `fix/`, `docs/`, `chore/`...) y el merge a `main` lo hace Marthin manualmente vía PR. `release-please` corta el release desde ahí.

## Estado actual

- **2026-08-14** — Se creó `CLAUDE.md` (arquitectura) y esta bitácora, en castellano. Se eliminó el viejo `.claude/CLAUDE.md` y `.claude/commands/review.md` (decisión intencional de Marthin al correr `/init`, quería un `CLAUDE.md` nuevo de cero) — la filosofía Gentle AI + Ponytail + Clean Code que tenían quedó consolidada directamente en `CLAUDE.md`, ya no vive en un archivo separado. Se detectó un bug real: `backend/package.json` quedó en `1.4.0` pero el sitio ya llevaba `1.10.0` publicado (`CHANGELOG.md`), porque `release-please` no tiene manifest y no toca ese archivo — el footer (`/api/version`) mostraba la versión vieja en producción. Se resolvió con bump manual a `1.10.0` en rama aparte (`fix/sincronizar-version-backend`, pendiente de merge). Causa raíz sin resolver todavía: sin manifest, va a desincronizarse de nuevo en el próximo release si no se recuerda bumpear a mano.

- **2026-08-14** — Diagnóstico inicial correcto: el frontend no se actualizaba solo en Hostinger porque hay dos despliegues separados (backend por Git, frontend estático a mano en `public_html`). Se agregó `.github/workflows/deploy-frontend.yml` (sube `frontend/` por FTPS, `HOSTINGER_FTP_SERVER_DIR=/`) para automatizarlo — funcionó en la prueba manual, pero después se dudó del diagnóstico sin evidencia sólida y se lo dio de baja por error (ver incidente abajo, ya corregido).

- **2026-08-14** — Se resolvió la causa raíz del desfasaje de versión: se agregaron `release-please-config.json` + `.release-please-manifest.json` (modo manifest, paquete raíz `"."`, tags y `CHANGELOG.md` sin cambios) con `extra-files` apuntando por jsonpath a `backend/package.json` y `backend/package-lock.json`. Al mergear, el manifest se sembró con `1.10.0` pero `release-please` ya había publicado `1.10.1` unos minutos antes por una PR de release que estaba pendiente de antes (parece haber auto-merge activado para esas PRs) — el manifest quedó desactualizado un rato y generó una PR de release duplicada para la misma versión, que falló al intentar crear el tag `v1.10.1` de nuevo (ya existía). No pasó nada grave: ningún tag quedó duplicado, el manifest se autocorrigió solo a `1.10.1` al mergear esa PR, y `backend/package.json`/`package-lock.json` quedaron sincronizados como se buscaba — la única secuela fue una sección `## [1.10.1]` duplicada en `CHANGELOG.md`, corregida a mano. Lección: si el merge de una PR con manifest sembrado tarda, conviene revisar el último tag real justo antes de mergear, no confiar en lo que se sabía al escribir la config.

- **2026-08-14 — 🔴 Incidente: sitio caído en producción, resuelto.** `public_html` quedó vacío (solo `.htaccess`) — causa exacta sin confirmar del todo, probablemente relacionada con la prueba de FTP, pero no se pudo probar con certeza. En el apuro se dudó del diagnóstico original (dos despliegues separados) sin evidencia y se llegó a creer, por error, que era un solo despliegue — se borró `.github/workflows/deploy-frontend.yml` en base a esa idea equivocada. Se confirmó la verdad mirando **hPanel → Despliegues → detalles del deploy**: `Directorio root: backend`, o sea el Node.js App nunca tocó `frontend/`. El diagnóstico original era correcto.
  - **Restaurado**: subida manual de `frontend/` a `public_html` por hPanel. Primer intento falló por subir la carpeta `frontend` completa en vez de su contenido (quedó en `public_html/frontend/index.html` en vez de `public_html/index.html`) — corregido moviendo el contenido un nivel arriba. Confirmado con curl y Chrome (200 OK, sin errores de consola, título correcto).
  - **Lección**: no dar de baja una decisión ya tomada con evidencia (la pantalla de Despliegues) solo porque algo salió mal — primero confirmar la causa real antes de revertir arquitectura.
  - **Pendiente**: `deploy-frontend.yml` sigue borrado (PR #73, ya mergeada). Se puede volver a agregar con confianza ahora que el diagnóstico está confirmado, pero ojo: `local-dir: ./frontend/` (con barra final) sube el *contenido*, no la carpeta — no repetir el error de la subida manual.

## Pendientes / próximos pasos

- [ ] Evaluar si recrear `deploy-frontend.yml` (el diagnóstico de fondo era correcto, ver incidente arriba) o dejar la subida a `public_html` manual por ahora.
- [ ] Borrar los secrets `HOSTINGER_FTP_*` de GitHub si se decide no recrear el workflow.
