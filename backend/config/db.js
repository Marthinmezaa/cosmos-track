const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión diferida
pool.getConnection()
    .then(connection => {
        console.log('Conectado a la base de datos MySQL en Hostinger');
        connection.release();
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err.message);
    });

module.exports = {
    query: async (sql, params) => {
        const [results] = await pool.execute(sql, params);
        return results;
    },
    pool
};
