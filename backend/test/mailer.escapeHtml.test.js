// Self-check de escapeHtml: los campos del formulario público van sin sanitizar
// al HTML del correo de notificación, así que esta función es la única barrera
// contra inyección HTML/script vía nombre, mensaje, etc.
// Correr: node --test backend/test
const test = require('node:test');
const assert = require('node:assert');
const { escapeHtml } = require('../config/mailer');

test('escapa las entidades HTML peligrosas', () => {
    assert.strictEqual(
        escapeHtml('<img src=x onerror=alert(1)>'),
        '&lt;img src=x onerror=alert(1)&gt;'
    );
    assert.strictEqual(escapeHtml(`O'Brien & Cía "Test"`), 'O&#39;Brien &amp; Cía &quot;Test&quot;');
});

test('no rompe con valores vacíos o nulos', () => {
    assert.strictEqual(escapeHtml(undefined), '');
    assert.strictEqual(escapeHtml(null), '');
    assert.strictEqual(escapeHtml(''), '');
});

test('deja intacto un texto sin caracteres especiales', () => {
    assert.strictEqual(escapeHtml('Juan Perez'), 'Juan Perez');
});
