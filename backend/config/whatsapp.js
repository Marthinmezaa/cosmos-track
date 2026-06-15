const axios = require('axios');

/**
 * Envía una notificación de WhatsApp utilizando el servicio gratuito CallMeBot.
 * Nota: Los destinatarios deben haber activado previamente el bot enviando
 * "I allow callmebot to send me messages" al número del bot.
 */
const sendWhatsAppNotification = async (contactData) => {
    const { nombre, apellido, telefono, servicio } = contactData;

    const messageText = `*Nueva Solicitud de Cotización*\n\n` +
                        `*Nombre:* ${nombre}\n` +
                        `*Apellido:* ${apellido || ''}\n` +
                        `*Teléfono:* ${telefono}\n` +
                        `*Vehículo:* ${servicio}\n\n` +
                        `Favor ponerse en contacto a la brevedad.`;

    const recipients = [
        {
            phone: process.env.WHATSAPP_PHONE_CLIENT,
            apikey: process.env.WHATSAPP_APIKEY_CLIENT
        },
        {
            phone: process.env.WHATSAPP_PHONE_ADMIN,
            apikey: process.env.WHATSAPP_APIKEY_ADMIN
        }
    ];

    for (const recipient of recipients) {
        if (recipient.phone && recipient.apikey) {
            try {
                // Usamos URLSearchParams o el objeto params de axios para asegurar el encoding correcto
                await axios.get('https://api.callmebot.com/whatsapp.php', {
                    params: {
                        phone: recipient.phone.replace('+', ''), // CallMeBot prefiere números sin el +
                        text: messageText,
                        apikey: recipient.apikey
                    }
                });
                console.log(`Notificación de WhatsApp enviada a ${recipient.phone}`);
            } catch (error) {
                console.error(`Error enviando WhatsApp a ${recipient.phone}:`, error.message);
            }
        }
    }
};

module.exports = { sendWhatsAppNotification };
