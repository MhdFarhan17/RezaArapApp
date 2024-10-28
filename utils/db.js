const mongoose = require('mongoose');

// Menampilkan URI untuk memastikan variabel lingkungan sudah benar
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Menghubungkan ke MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Waktu tunggu untuk memilih server MongoDB (30 detik)
}).then(() => {
    console.log('MongoDB connected successfully');
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
