const pool = require('./db');

// Load voice times from the database
async function loadVoiceTimes() {
    const [rows] = await pool.query("SELECT * FROM voiceTimes");
    const voiceTimes = {};
    rows.forEach(row => {
        voiceTimes[row.userId] = { totalTime: row.totalTime, joinTime: row.joinTime };
    });
    return voiceTimes;
}

// Save voice time to the database
async function saveVoiceTime(userId, totalTime, joinTime = null) {
    await pool.query(`
        INSERT INTO voiceTimes (userId, totalTime, joinTime)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE totalTime = ?, joinTime = ?`,
        [userId, totalTime, joinTime, totalTime, joinTime]
    );
}

// Reset all voice times (for resetdata! command)
async function resetVoiceTimes() {
    await pool.query("DELETE FROM voiceTimes");
}

module.exports = { loadVoiceTimes, saveVoiceTime, resetVoiceTimes };
