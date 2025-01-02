require('../utils/db');
const mongoose = require('mongoose');

// Definisi skema voice time
const voiceTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalTime: { type: Number, default: 0, min: 0 },
    joinTime: { type: Number, default: null, validate: v => v === null || v >= 0 },
}, { timestamps: true }); // Menambahkan createdAt dan updatedAt otomatis

const VoiceTime = mongoose.model('VoiceTime', voiceTimeSchema);

// Fungsi untuk memuat semua voice times
async function loadVoiceTimes() {
    try {
        const voiceTimes = await VoiceTime.find();
        return voiceTimes.reduce((acc, doc) => {
            acc[doc.userId] = { totalTime: doc.totalTime, joinTime: doc.joinTime };
            return acc;
        }, {});
    } catch (error) {
        console.error('Error loading voice times:', error.message);
        return {};
    }
}

// Fungsi untuk menyimpan atau memperbarui voice time
async function saveVoiceTime(userId, totalTime, joinTime = null) {
    try {
        if (!userId) {
            console.error('Invalid userId provided to saveVoiceTime.');
            return;
        }

        // Validasi tambahan untuk totalTime
        if (totalTime < 0) {
            console.error('Total time must be a non-negative value.');
            return;
        }

        await VoiceTime.updateOne(
            { userId },
            { totalTime, joinTime },
            { upsert: true }
        );
    } catch (error) {
        console.error(`Error saving voice time for userId ${userId}:`, error.message);
    }
}

// Fungsi untuk menghapus data voice time (opsional, bisa digunakan untuk debug)
async function deleteVoiceTime(userId) {
    try {
        const result = await VoiceTime.deleteOne({ userId });
        if (result.deletedCount > 0) {
            console.log(`Voice time for userId ${userId} deleted successfully.`);
        } else {
            console.warn(`No voice time found for userId ${userId}.`);
        }
    } catch (error) {
        console.error(`Error deleting voice time for userId ${userId}:`, error.message);
    }
}

module.exports = { VoiceTime, loadVoiceTimes, saveVoiceTime, deleteVoiceTime };
