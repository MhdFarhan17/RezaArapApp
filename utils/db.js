const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'autorack.proxy.rlwy.net', // Sesuaikan dengan host dari Railway
    user: process.env.DB_USER, // pastikan variabel ini disetel di environment Railway
    password: process.env.DB_PASSWORD, // pastikan variabel ini disetel di environment Railway
    database: process.env.DB_NAME, // pastikan variabel ini disetel di environment Railway
    port: 22700, // Gunakan port yang sesuai dari informasi Railway
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
