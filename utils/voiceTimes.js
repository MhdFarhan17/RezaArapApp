require('../utils/db');

const mongoose = require('mongoose');

const voiceTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalTime: { type: Number, default: 0 },
    joinTime: { type: Number, default: null },
});

const VoiceTime = mongoose.model('VoiceTime', voiceTimeSchema);

async function loadVoiceTimes() {
    const voiceTimes = await VoiceTime.find();
    return voiceTimes.reduce((acc, doc) => {
        acc[doc.userId] = { totalTime: doc.totalTime, joinTime: doc.joinTime };
        return acc;
    }, {});
}

async function saveVoiceTime(userId, totalTime, joinTime = null) {
    await VoiceTime.updateOne(
        { userId },
        { totalTime, joinTime },
        { upsert: true }
    );
}

module.exports = { loadVoiceTimes, saveVoiceTime };
