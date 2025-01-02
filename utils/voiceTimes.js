require('../utils/db');
const mongoose = require('mongoose');

const voiceTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalTime: { type: Number, default: 0, min: 0 },
    joinTime: { type: Number, default: null, validate: v => v === null || v >= 0 },
});

const VoiceTime = mongoose.model('VoiceTime', voiceTimeSchema);

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

async function saveVoiceTime(userId, totalTime, joinTime = null) {
    try {
        if (!userId) {
            console.error('Invalid userId provided to saveVoiceTime.');
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

module.exports = { VoiceTime, loadVoiceTimes, saveVoiceTime };