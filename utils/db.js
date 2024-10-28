require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // 30 detik
    connectTimeoutMS: 30000,         // 30 detik
    socketTimeoutMS: 45000           // 45 detik
}).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.error('Database connection failed:', error.message);
});

// Event listener untuk memantau status koneksi
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Fungsi untuk memutuskan koneksi dengan MongoDB
function closeConnection() {
    mongoose.connection.close(() => {
        console.log('Mongoose connection closed');
        process.exit(0); // Menutup aplikasi dengan status 0 (berhasil)
    });
}

// Menutup koneksi saat aplikasi dihentikan
process.on('SIGINT', closeConnection).on('SIGTERM', closeConnection);

module.exports = mongoose;
