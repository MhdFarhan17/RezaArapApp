require('dotenv').config();
const mongoose = require('mongoose');

// Menampilkan URI untuk memastikan variabel lingkungan sudah benar
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000 // Mengatur waktu tunggu koneksi
}).then(() => {
    console.log('MongoDB connected successfully!');
    process.exit(0);
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
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
