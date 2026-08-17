// Self-check de las validaciones de submitForm que cortan ANTES de tocar la DB
// (nombre, tipo_formulario, telefono). No requiere DB/SMTP reales: los módulos
// que formController importa configuran sus clientes de forma perezosa.
// Correr: node --test backend/test
const test = require('node:test');
const assert = require('node:assert');
const { submitForm } = require('../controllers/formController');

function mockRes() {
    return {
        statusCode: null,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; return this; }
    };
}

test('rechaza formulario sin nombre', async () => {
    const res = mockRes();
    await submitForm({ body: { telefono: '0987123456', tipo_formulario: 'contacto' } }, res);
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.body.message, /nombre/i);
});

test('rechaza tipo_formulario fuera de contacto/cotizacion', async () => {
    const res = mockRes();
    await submitForm({ body: { nombre: 'Juan', telefono: '0987123456', tipo_formulario: 'spam' } }, res);
    assert.strictEqual(res.statusCode, 400);
});

test('rechaza telefono con formato invalido', async () => {
    const res = mockRes();
    await submitForm({ body: { nombre: 'Juan', telefono: '123', tipo_formulario: 'contacto' } }, res);
    assert.strictEqual(res.statusCode, 400);
});
