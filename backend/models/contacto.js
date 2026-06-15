const db = require('../config/db');

const Contacto = {
    create: async (data) => {
        const { nombre, email, telefono, asunto, mensaje, servicio, tipo_formulario } = data;
        const query = `
            INSERT INTO contactos (nombre, email, telefono, asunto, mensaje, servicio, tipo_formulario)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [nombre, email, telefono, asunto, mensaje, servicio, tipo_formulario];
        const res = await db.query(query, values);

        // MySQL no tiene RETURNING, devolvemos el id insertado y los datos
        return {
            id: res.insertId,
            ...data
        };
    }
};

module.exports = Contacto;
