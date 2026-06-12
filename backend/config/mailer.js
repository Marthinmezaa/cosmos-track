const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true para puerto 465, false para otros
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendContactEmail = async (contactData) => {
    const { nombre, email, telefono, asunto, mensaje, servicio, tipo_formulario } = contactData;

    const subject = tipo_formulario === 'cotizacion'
        ? `Nueva Solicitud de Cotización: ${servicio}`
        : `Nuevo Mensaje de Contacto: ${asunto}`;

    const htmlContent = `
        <h2>Nueva notificación desde CosmosTrak Web</h2>
        <p><strong>Tipo:</strong> ${tipo_formulario.toUpperCase()}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        ${servicio ? `<p><strong>Servicio solicitado:</strong> ${servicio}</p>` : ''}
        ${asunto ? `<p><strong>Asunto:</strong> ${asunto}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje || 'Sin mensaje'}</p>
        <hr>
        <p>Este correo fue generado automáticamente desde el servidor del sitio web.</p>
    `;

    try {
        await transporter.sendMail({
            from: `"CosmosTrak Web" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: subject,
            html: htmlContent
        });
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw error;
    }
};

module.exports = { sendContactEmail };
