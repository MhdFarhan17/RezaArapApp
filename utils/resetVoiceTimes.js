const moment = require('moment-timezone');
const { VoiceTime } = require('./voiceTimes');

async function resetVoiceTimes() {
    try {
        const result = await VoiceTime.updateMany({}, { $set: { totalTime: 0, joinTime: null } });

        console.log(
            `Data voiceTimes telah direset pada ${moment()
                .tz("Asia/Jakarta")
                .format("YYYY-MM-DD HH:mm:ss")} WIB. Dokumen yang diperbarui: ${result.modifiedCount}`
        );
    } catch (error) {
        console.error('Terjadi kesalahan saat mereset data:', error.message);
    }
}

module.exports = { resetVoiceTimes };