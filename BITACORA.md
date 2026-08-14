# Bitácora del proyecto

Registro vivo de decisiones, mejoras y estado de avance de la web de Cosmos Trak. `CLAUDE.md` documenta la arquitectura (qué es el código); este archivo documenta el proceso (qué fuimos haciendo y por qué). No duplica `CHANGELOG.md` (eso lo genera `release-please` automáticamente desde los commits) — acá va el contexto que un mensaje de commit no cuenta: decisiones, pendientes, estado en el que quedó todo.

## Qué es el proyecto

Sitio institucional de Cosmos Trak, empresa de monitoreo satelital y rastreo GPS en Paraguay. Frontend estático (HTML/CSS/jQuery, sin build) servido por un backend Express que además procesa los formularios de contacto y cotización. Detalle técnico completo en `CLAUDE.md`.

## Hosting

Todo corre en **Hostinger**, en un solo despliegue: un Node.js App con auto-deploy por Git que sirve tanto el backend como el frontend (Express sirve `frontend/` como estático). No hay un segundo hosting estático separado — eso se creyó por error el 14/08, ver incidente más abajo. Base de datos MySQL y SMTP también viven en Hostinger. Detalle completo en `CLAUDE.md`.

## Filosofía de desarrollo

Gentle AI + Ponytail + Clean Code, reglas completas en `CLAUDE.md`. En corto: minimalismo real (YAGNI), cero abstracciones especulativas, código que se explica solo, enseñar el porqué de cada decisión no trivial.

## Flujo de Git

Nunca se commitea directo a `main`. Toda tarea va en su propia rama (`feat/`, `fix/`, `docs/`, `chore/`...) y el merge a `main` lo hace Marthin manualmente vía PR. `release-please` corta el release desde ahí.

## Estado actual

- **2026-08-14** — Se creó `CLAUDE.md` (arquitectura) y esta bitácora, en castellano. Se eliminó el viejo `.claude/CLAUDE.md` y `.claude/commands/review.md` (decisión intencional de Marthin al correr `/init`, quería un `CLAUDE.md` nuevo de cero) — la filosofía Gentle AI + Ponytail + Clean Code que tenían quedó consolidada directamente en `CLAUDE.md`, ya no vive en un archivo separado. Se detectó un bug real: `backend/package.json` quedó en `1.4.0` pero el sitio ya llevaba `1.10.0` publicado (`CHANGELOG.md`), porque `release-please` no tiene manifest y no toca ese archivo — el footer (`/api/version`) mostraba la versión vieja en producción. Se resolvió con bump manual a `1.10.0` en rama aparte (`fix/sincronizar-version-backend`, pendiente de merge). Causa raíz sin resolver todavía: sin manifest, va a desincronizarse de nuevo en el próximo release si no se recuerda bumpear a mano.

- **2026-08-14** — ⚠️ **Diagnóstico equivocado, revertido más abajo.** Se creyó que el frontend no se actualizaba solo en Hostinger porque habría dos despliegues separados (backend por Git, frontend estático a mano en `public_html`) — pista mal leída: la whitelist de CORS con varios orígenes en `index.js` es resabio de una migración vieja a Render, no evidencia de un segundo hosting. Se agregó `.github/workflows/deploy-frontend.yml` (sube `frontend/` por FTPS) y se probó con un disparo manual con `HOSTINGER_FTP_SERVER_DIR=/`. Ver el incidente de más abajo: esto rompió el sitio en producción.

- **2026-08-14** — Se resolvió la causa raíz del desfasaje de versión: se agregaron `release-please-config.json` + `.release-please-manifest.json` (modo manifest, paquete raíz `"."`, tags y `CHANGELOG.md` sin cambios) con `extra-files` apuntando por jsonpath a `backend/package.json` y `backend/package-lock.json`. Al mergear, el manifest se sembró con `1.10.0` pero `release-please` ya había publicado `1.10.1` unos minutos antes por una PR de release que estaba pendiente de antes (parece haber auto-merge activado para esas PRs) — el manifest quedó desactualizado un rato y generó una PR de release duplicada para la misma versión, que falló al intentar crear el tag `v1.10.1` de nuevo (ya existía). No pasó nada grave: ningún tag quedó duplicado, el manifest se autocorrigió solo a `1.10.1` al mergear esa PR, y `backend/package.json`/`package-lock.json` quedaron sincronizados como se buscaba — la única secuela fue una sección `## [1.10.1]` duplicada en `CHANGELOG.md`, corregida a mano. Lección: si el merge de una PR con manifest sembrado tarda, conviene revisar el último tag real justo antes de mergear, no confiar en lo que se sabía al escribir la config.

- **2026-08-14 — 🔴 Incidente: sitio caído en producción.** El deploy de prueba por FTP (`server-dir: /`) subió `frontend/` al directorio raíz real de la cuenta de Hostinger, no a `public_html` — porque en realidad **no existe un `public_html` separado**: el Node.js App clona el repo entero (backend + frontend juntos) y Express sirve `frontend/` como estático desde ahí mismo. El deploy por FTP chocó con esa misma carpeta que el Git auto-deploy del Node App ya mantenía, y el siguiente redeploy automático (disparado por los merges de `release-please`) quedó sin la carpeta `frontend/` — el backend sigue funcionando (`/api/version` responde con la versión correcta), pero `/`, `/index.html` y los assets devuelven 404.
  - **Acción tomada**: se eliminó `.github/workflows/deploy-frontend.yml` (rama `fix/desactivar-deploy-ftp-frontend`) para que no se repita en cada push a `frontend/`.
  - **Pendiente**: restaurar `frontend/` en el servidor — probar primero un redeploy manual del Node.js App desde hPanel (sección "Despliegues"), y si no alcanza, revisar en el Administrador de archivos si quedaron archivos sueltos en la raíz del dominio (fuera de `frontend/`) por el FTP de prueba, y limpiarlos.
  - Los secrets `HOSTINGER_FTP_*` quedan sin uso en GitHub — se pueden borrar cuando se confirme que el sitio volvió a andar.

## Pendientes / próximos pasos

- [ ] Restaurar `frontend/` en Hostinger y confirmar que el sitio vuelve a cargar (ver incidente arriba).
- [ ] Borrar los secrets `HOSTINGER_FTP_*` de GitHub, ya sin uso.
