const mongoose = require('mongoose');

// Define the schema
const voiceTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    totalTime: { type: Number, default: 0 },
    joinTime: { type: Number, default: null },
});

// Create the model
const VoiceTime = mongoose.model('VoiceTime', voiceTimeSchema);

// Load all voice times from MongoDB
async function loadVoiceTimes() {
    const voiceTimes = await VoiceTime.find();
    return voiceTimes.reduce((acc, doc) => {
        acc[doc.userId] = { totalTime: doc.totalTime, joinTime: doc.joinTime };
        return acc;
    }, {});
}

// Save or update the user's voice time data in MongoDB
async function saveVoiceTime(userId, totalTime, joinTime = null) {
    await VoiceTime.updateOne(
        { userId },
        { totalTime, joinTime },
        { upsert: true }
    );
}

module.exports = { loadVoiceTimes, saveVoiceTime };