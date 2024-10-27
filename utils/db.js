// Isi dari db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;

// Tambahkan kode testing ini di akhir file
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Database connection successful!");
        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

testConnection();
