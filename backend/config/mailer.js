const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Forzamos la dirección correcta aquí
  port: 587,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: "info@cosmostrak.com.py", // Forzamos el usuario aquí
    pass: process.env.EMAIL_PASS, // Dejamos solo la contraseña oculta por seguridad
  },
  tls: {
    rejectUnauthorized: false, // (Opcional, pero recomendado si hay problemas de certificados)
  },
  family: 4,
});

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
        <p><strong>Tipo:</strong> ${tipo_formulario.toUpperCase()}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        ${apellido ? `<p><strong>Apellido:</strong> ${apellido}</p>` : ""}
        <p><strong>Teléfono:</strong> ${telefono}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        ${servicio ? `<p><strong>Servicio solicitado:</strong> ${servicio}</p>` : ""}
        ${asunto ? `<p><strong>Asunto:</strong> ${asunto}</p>` : ""}
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje || "Sin mensaje"}</p>
        <hr>
        <p>Este correo fue generado automáticamente desde el servidor del sitio web.</p>
    `;

  try {
    await transporter.sendMail({
      from: `"CosmosTrak Web" <${process.env.EMAIL_USER}>`,
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

module.exports = { sendContactEmail };
