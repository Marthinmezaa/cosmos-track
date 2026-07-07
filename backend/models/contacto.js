const db = require('../config/db');

const Contacto = {
    create: async (data) => {
        const { nombre, apellido, email, telefono, asunto, mensaje, servicio, tipo_formulario } = data;
        const query = `
            INSERT INTO contactos (nombre, apellido, email, telefono, asunto, mensaje, servicio, tipo_formulario)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [nombre, apellido || null, email, telefono, asunto, mensaje, servicio, tipo_formulario];

        // El método db.query ya devuelve res.rows
        const rows = await db.query(query, values);

        // Retornamos el primer elemento (el registro recién creado con su ID)
        return rows[0];
    }
};

module.exports = Contacto;
