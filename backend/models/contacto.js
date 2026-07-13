const db = require('../config/db');

const Contacto = {
    create: async (data) => {
        const { nombre, apellido, email, telefono, asunto, mensaje, servicio, tipo_formulario } = data;

        // En MySQL, utilizamos la sintaxis con comodines '?' para las consultas preparadas.
        const query = `
            INSERT INTO contactos (nombre, apellido, email, telefono, asunto, mensaje, servicio, tipo_formulario)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [nombre, apellido || null, email, telefono, asunto, mensaje, servicio, tipo_formulario];

        // El método db.query devuelve las filas afectadas u objeto de inserción en MySQL.
        // Hacemos la consulta para insertar los datos.
        const result = await db.query(query, values);

        // En mysql2/promise, tras una inserción exitosa, el resultado de `query` (que retorna `rows` de execute)
        // contiene propiedades como `insertId` y `affectedRows`.
        // Para emular el comportamiento 'RETURNING *' de PostgreSQL, retornamos un objeto
        // con los datos enviados y el ID generado de forma limpia.
        return {
            id: result.insertId || null,
            nombre,
            apellido: apellido || null,
            email,
            telefono,
            asunto,
            mensaje,
            servicio,
            tipo_formulario
        };
    }
};

module.exports = Contacto;
