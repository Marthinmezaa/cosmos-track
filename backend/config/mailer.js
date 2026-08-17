const nodemailer = require("nodemailer");
require("dotenv").config();

// Único origen de verdad para el remitente: se usa tanto para autenticar en
// el SMTP de Hostinger como para el header "From" del correo. Antes el From
// salía de process.env.EMAIL_USER, que podía no coincidir con este usuario —
// Hostinger rechaza (o reescribe) un From que no matchea el usuario SMTP
// autenticado, y ese fallo quedaba silencioso (ver catch en submitForm).
const SMTP_USER = "info@cosmostrak.com.py";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Forzamos la dirección correcta aquí
  port: 587,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: SMTP_USER,
    pass: process.env.EMAIL_PASS, // Dejamos solo la contraseña oculta por seguridad
  },
  tls: {
    rejectUnauthorized: false, // (Opcional, pero recomendado si hay problemas de certificados)
  },
  family: 4,
});

// Escapa los campos del formulario antes de meterlos en el HTML del correo:
// vienen sin sanitizar desde el formulario público (ver formController.js).
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])
  );

const sendContactEmail = async (contactData) => {
  const {
    nombre,
    apellido,
    email,
    telefono,
    asunto,
    mensaje,
    servicio,
    tipo_formulario,
  } = contactData;

  const subject =
    tipo_formulario === "cotizacion"
      ? `Nueva Solicitud de Cotización: ${servicio}`
      : `Nuevo Mensaje de Contacto: ${asunto}`;

  const htmlContent = `
        <h2>Nueva notificación desde CosmosTrak Web</h2>
        <p><strong>Tipo:</strong> ${escapeHtml(tipo_formulario).toUpperCase()}</p>
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        ${apellido ? `<p><strong>Apellido:</strong> ${escapeHtml(apellido)}</p>` : ""}
        <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
        ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
        ${servicio ? `<p><strong>Servicio solicitado:</strong> ${escapeHtml(servicio)}</p>` : ""}
        ${asunto ? `<p><strong>Asunto:</strong> ${escapeHtml(asunto)}</p>` : ""}
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje ? escapeHtml(mensaje) : "Sin mensaje"}</p>
        <hr>
        <p>Este correo fue generado automáticamente desde el servidor del sitio web.</p>
    `;

  try {
    await transporter.sendMail({
      from: `"CosmosTrak Web" <${SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: subject,
      html: htmlContent,
    });
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};

module.exports = { sendContactEmail, escapeHtml };
