# CLAUDE.md

Este archivo le da contexto a Claude Code (claude.ai/code) para trabajar en este repositorio.

## Proyecto

Sitio institucional de Cosmos Trak (empresa de monitoreo satelital y rastreo GPS, Paraguay). Frontend estático, sin framework, servido por un backend Express que además procesa los formularios de contacto y cotización.

## Comandos

Todos los comandos corren desde `backend/` (no hay `package.json` en la raíz):

```bash
cd backend
npm install
npm start        # node index.js
npm run dev       # node --watch index.js (auto-reinicio)
```

- No existe suite de tests — `npm test` es un stub sin configurar que sale con error.
- No hay lint/formateo configurado.
- DB local: correr `backend/models/schema.sql` contra MySQL para crear la tabla `contactos`.
- Variables de entorno requeridas (`backend/.env`, gitignored): `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`/`DB_SSL_REJECT_UNAUTHORIZED` (opcional), `DB_CONNECTION_LIMIT` (opcional), `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `WHATSAPP_PHONE_ADMIN`, `WHATSAPP_APIKEY_ADMIN`, `WHATSAPP_PHONE_CLIENT`/`WHATSAPP_APIKEY_CLIENT` (opcional, segundo destinatario de notificación).

## Arquitectura

**Dos carpetas, un solo servidor.** `backend/index.js` es el único punto de entrada: monta las rutas de la API, sirve `frontend/` como archivos estáticos, y para cualquier ruta que no sea `/api` cae en `frontend/index.html` (URLs limpias, no es una SPA — el frontend no tiene router del lado del cliente).

**Frontend (`frontend/`)** — HTML5/CSS3 plano + jQuery, sin build, sin framework. Tres páginas: `index.html`, `flotas.html`, `particulares.html`, compartiendo `assets/{css,js,img,fonts}`.

**Backend (`backend/`)** — Express 5, en capas `routes/ → controllers/ → models/ → config/`:
- `config/db.js` — pool de MySQL2 (`db.query()` envuelve `pool.execute()` y devuelve `rows`, emulando el estilo de llamada que tenía Postgres antes).
- `config/mailer.js` — Nodemailer vía SMTP de Hostinger (host/usuario están hardcodeados, solo la contraseña viene de env).
- `config/whatsapp.js` — notificaciones vía API de CallMeBot (nivel gratuito; los destinatarios deben haberse suscrito al bot por WhatsApp de antemano).
- `models/contacto.js` — un único `Contacto.create()` que inserta en la tabla `contactos`.
- `controllers/formController.js` — la única lógica de negocio real del backend.
- `routes/formRoutes.js` → `POST /api/form/submit`; `routes/systemRoutes.js` → `GET /api/version` (lee `package.json`, sin DB).

**Flujo de envío de formularios** (lo esencial para entender antes de tocar formularios):
1. `frontend/assets/js/form-handler.js` intercepta los submits de `#contactForm` y de cualquier `.courses-form`/`#installForm`, arma un payload JSON (`tipo_formulario` es `'contacto'` o `'cotizacion'`) y lo postea a `/api/form/submit`.
2. `formController.submitForm` valida `telefono` contra `TELEFONO_REGEX = /^0\d{9}$/` antes que nada, antes de tocar la DB — es la única fuente de verdad para la validación de teléfono, no la repitas en otro lado.
3. Guarda en MySQL vía `Contacto.create`.
4. Siempre manda un email de notificación (si falla, se loguea pero no hace fallar el request — el contacto ya quedó guardado).
5. Manda notificación por WhatsApp vía CallMeBot **solo cuando `tipo_formulario === 'cotizacion'`** (pedidos de cotización, no mensajes de contacto general) — tampoco bloquea el request si falla.

**Versionado**: `release-please` corre en modo manifest (`release-please-config.json` + `.release-please-manifest.json`, ambos en la raíz). El paquete es la raíz del repo (`"."`, `release-type: simple`, tags planos `vX.Y.Z`, `CHANGELOG.md` en la raíz — igual que siempre) y usa `extra-files` con jsonpath para bumpear además `backend/package.json` y `backend/package-lock.json` en cada release. `GET /api/version` lee esa versión y `frontend/assets/js/version-handler.js` la renderiza en el footer (`#app-version`) — ahora se mantiene sincronizada sola, no hace falta bumpear a mano.

## CI

- `.github/workflows/devsecops.yml` — en push/PR a `main`: escaneo de secretos con Gitleaks, luego `npm audit --audit-level=high` en `backend/`.
- `.github/workflows/release-please.yml` — automatiza bumps de versión/releases a partir de Conventional Commits en `main`.
- `.github/workflows/deploy-frontend.yml` — en push a `main` que toque `frontend/**`, sube esa carpeta por FTPS al `public_html` de Hostinger (`SamKirkland/FTP-Deploy-Action`). Requiere los secrets `HOSTINGER_FTP_SERVER`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD`, `HOSTINGER_FTP_SERVER_DIR`.

## Hosting

Todo corre en **Hostinger**, pero en dos despliegues separados — importante no asumir que es uno solo:
- **Backend**: Node.js App de Hostinger con auto-deploy por Git, clona el repo completo y arranca `backend/index.js` solo. Se actualiza automáticamente en cada push a `main`.
- **Frontend**: se sirve como sitio estático desde `public_html` (por eso el dominio público necesita CORS explícito en `config/db.js`/`index.js` para hablarle a la API — no comparten origen). Antes se subía a mano por hPanel en cada cambio; ahora lo hace `deploy-frontend.yml` automáticamente.
- Base de datos MySQL y el relay SMTP (`smtp.hostinger.com`, hardcodeado en `config/mailer.js`) también viven ahí.

## Filosofía de desarrollo

Este proyecto combina Gentle AI + Ponytail + Clean Code. En la práctica:

- **YAGNI primero:** antes de escribir código nuevo, preguntate si hace falta de verdad. Resolvé el problema de hoy con la mínima lógica viable, nada "por si acaso".
- **La jerarquía Ponytail**, en orden: ¿hace falta esto? → ¿lo resuelve el estándar del lenguaje/plataforma (CSS/HTML/SQL nativo)? → ¿lo resuelve una dependencia que ya está instalada? → ¿es un one-liner legible? → recién ahí, código nuevo.
- **Cero dependencias nuevas** salvo que hacerlo nativo implique un esfuerzo desproporcionado.
- **Cambios quirúrgicos:** el diff más chico y aislado posible; preservar la funcionalidad existente salvo que se pida lo contrario.
- **Código autoexplicativo:** nombres claros, sin números mágicos, comentarios mínimos (el código explica el qué; el comentario, cuando existe, explica el porqué).
- **Cazar código muerto:** borrar activamente lo que quedó sin usar u obsoleto, en vez de acumularlo.
- **Debugging por causa raíz:** identificar por qué pasó el bug, no solo taparlo — y explicar el motivo, no solo el parche.
- **Enseñar mientras se implementa:** si hay una alternativa más simple, explicarla y recomendarla en vez de aceptar en silencio una decisión sobre-diseñada.
- Correctitud > cleverness. Minimalismo > escalabilidad teórica. La simplicidad radical es la medida de calidad.

## Flujo de Git

Nunca se commitea directo a `main`. Cada cambio va en su propia rama (`feat/`, `fix/`, `docs/`, `chore/`, `ci/` — como ya es costumbre en el historial) y el merge lo hace Marthin vía PR, igual que todas las ramas que ya existen en este repo. `release-please` corta el release desde ahí.

## Bitácora del proyecto

El avance, las decisiones y el "dónde quedamos" viven en `BITACORA.md`, en la raíz del repo — revisala antes de arrancar una sesión, actualizala antes de terminarla. Este archivo se mantiene como referencia estática de arquitectura; no crece con notas del día a día.
