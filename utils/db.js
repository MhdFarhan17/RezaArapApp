const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,        // Host dari database Railway
    user: process.env.DB_USER,        // Username dari database Railway
    password: process.env.DB_PASSWORD, // Password dari database Railway
    database: process.env.DB_NAME,    // Nama database di Railway
    port: parseInt(process.env.DB_PORT, 10) || 3306,  // Port dari Railway
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;