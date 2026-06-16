# Cosmos Trak - Web Institucional

Bienvenido al repositorio de la web institucional de **Cosmos Trak**, empresa líder en Paraguay dedicada a soluciones de monitoreo satelital, rastreo GPS e inteligencia operativa para flotas y activos móviles.

Este proyecto comprende una plataforma moderna, con diseño adaptativo (Mobile-First) y funcionalidades interactivas para el contacto y cotización de servicios.

## Tecnologías Utilizadas

### Frontend

- **HTML5 y CSS3 puro:** Sin frameworks pesados para garantizar la máxima velocidad de carga.
- **Diseño Mobile-First:** Optimizado para una experiencia fluida en smartphones y tablets.
- **Dark Mode:** Soporte nativo para modo oscuro basado en preferencias del usuario o selector manual.
- **Vanilla JS & jQuery:** Para manejo de DOM, validaciones y animaciones.

### Backend

- **Node.js & Express:** Servidor robusto y escalable.
- **MySQL:** Base de datos para la gestión de contactos y cotizaciones.
- **Nodemailer:** Sistema de notificaciones por correo electrónico.
- **CallMeBot API:** Integración de alertas automáticas vía WhatsApp.

---

## Infraestructura y DevOps

Nuestra infraestructura sigue prácticas modernas de **DevSecOps** para garantizar la seguridad y estabilidad del código:

- **GitHub Actions:** Automatización de flujos de trabajo.
- **Release Please:** Sistema de versionado automático basado en [Conventional Commits](https://www.conventionalcommits.org/). El número de versión se actualiza dinámicamente en el pie de página de la web.
- **Gitleaks:** Escaneo automático de secretos y credenciales para prevenir fugas de información.
- **npm Audit:** Auditoría de dependencias para identificar y mitigar vulnerabilidades conocidas.

---

## Configuración del Entorno de Desarrollo

Para clonar y ejecutar este proyecto localmente, sigue estos pasos:

### Pre-requisitos

- Node.js (v18 o superior recomendado)
- MySQL Server

### Pasos de Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/cosmos-trak.git
   cd cosmos-trak
   ```

2. **Configurar el Backend:**
   Entra en la carpeta del backend e instala las dependencias:

   ```bash
   cd backend
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la carpeta `backend/` basándote en el siguiente esquema:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=cosmos_trak

   EMAIL_HOST=smtp.hostinger.com
   EMAIL_PORT=465
   EMAIL_USER=tu_email
   EMAIL_PASS=tu_password

   WHATSAPP_PHONE_ADMIN=...
   WHATSAPP_APIKEY_ADMIN=...
   ```

4. **Base de Datos:**
   Ejecuta el script SQL ubicado en `backend/models/schema.sql` en tu instancia de MySQL para crear las tablas necesarias.

5. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## Enlaces Relevantes

- **Portal de Clientes (Trakzee):** [Acceso a Cliente](https://trakzee.uffizio.com/jsp/trakzee_login.jsp)
- **Sitio Web Oficial:** [cosmostrak.com.py](https://www.cosmostrak.com.py)

---

## Contacto

Si tienes dudas sobre el desarrollo de este proyecto, puedes contactar a **Marthin Meza**.

Desarrollado con ❤️ para Cosmos Trak.
