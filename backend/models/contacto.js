const db = require('../config/db');

const Contacto = {
    create: async (data) => {
        const { nombre, email, telefono, asunto, mensaje, servicio, tipo_formulario } = data;
        const query = `
            INSERT INTO contactos (nombre, email, telefono, asunto, mensaje, servicio, tipo_formulario)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [nombre, email, telefono, asunto, mensaje, servicio, tipo_formulario];
        const res = await db.query(query, values);
        return res.rows[0];
    }
};

module.exports = Contacto;
