const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
    : {
        host: process.env.PGHOST || process.env.DB_HOST,
        user: process.env.PGUSER || process.env.DB_USER,
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
        database: process.env.PGDATABASE || process.env.DB_NAME,
        port: process.env.PGPORT || 5432,
        ssl: {
            rejectUnauthorized: false
        }
    };

const pool = new Pool(poolConfig);

// Prueba de conexión
pool.connect()
    .then(client => {
        console.log('Conectado a la base de datos PostgreSQL (Neon)');
        client.release();
    })
    .catch(err => {
        console.error('Error conectando a la base de datos PostgreSQL:', err.message);
    });

module.exports = {
    query: async (text, params) => {
        const res = await pool.query(text, params);
        return res.rows;
    },
    pool
};
