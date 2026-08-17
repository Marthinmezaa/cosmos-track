// Self-check: los dos destinatarios de WhatsApp deben notificarse en paralelo,
// no uno atras del otro. Se reemplaza axios.get temporalmente para simular
// latencia sin pegarle a la API real de CallMeBot.
// Correr: node --test backend/test
const test = require('node:test');
const assert = require('node:assert');
const axios = require('axios');
const { sendWhatsAppNotification } = require('../config/whatsapp');

test('envia las notificaciones a los dos destinatarios en paralelo', async () => {
    const original = axios.get;
    const DELAY_MS = 80;
    axios.get = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

    process.env.WHATSAPP_PHONE_CLIENT = '+595900000001';
    process.env.WHATSAPP_APIKEY_CLIENT = 'apikey-client';
    process.env.WHATSAPP_PHONE_ADMIN = '+595900000002';
    process.env.WHATSAPP_APIKEY_ADMIN = 'apikey-admin';

    const start = Date.now();
    try {
        await sendWhatsAppNotification({ nombre: 'Juan', telefono: '0987123456', servicio: 'GPS' });
    } finally {
        axios.get = original;
    }
    const elapsed = Date.now() - start;

    // Secuencial tardaria ~2x DELAY_MS; en paralelo, ~1x DELAY_MS.
    assert.ok(elapsed < DELAY_MS * 1.8, `esperado <${DELAY_MS * 1.8}ms en paralelo, tardo ${elapsed}ms`);
});
