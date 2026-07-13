const mysql = require("mysql2/promise");
require("dotenv").config();

// Configuración opcional de SSL para MySQL si es requerida
let sslConfig = null;
if (process.env.DB_SSL === "true") {
  sslConfig = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

const poolConfig = {
  host: '127.0.0.1',
  user: 'u310821374_admin',
  password: 'Vc4GAbx9',
  database: 'u310821374_cosmos',
  port: parseInt(process.env.DB_PORT || "3306", 10),
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
  queueLimit: 0,
  ssl: sslConfig,
};

const pool = mysql.createPool(poolConfig);

// Prueba de conexión rápida
pool
  .getConnection()
  .then((connection) => {
    console.log("Conectado a la base de datos MySQL (Hostinger)");
    connection.release();
  })
  .catch((err) => {
    console.error("Error conectando a la base de datos MySQL:", err.message);
  });

module.exports = {
  /**
   * Ejecuta una consulta SQL en la base de datos MySQL.
   * Retorna directamente las filas de resultados (rows), emulando el comportamiento previo de Postgres.
   */
  query: async (text, params) => {
    const [rows] = await pool.execute(text, params);
    return rows;
  },
  pool,
};
