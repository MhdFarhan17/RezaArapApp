const moment = require('moment-timezone');
const { VoiceTime } = require('./voiceTimes');

async function resetVoiceTimes() {
    try {
        const totalDocuments = await VoiceTime.countDocuments();
        const result = await VoiceTime.updateMany({}, { $set: { totalTime: 0, joinTime: null } });

        if (result.modifiedCount === totalDocuments) {
            console.log(
                `Semua data voiceTimes berhasil direset pada ${moment()
                    .tz("Asia/Jakarta")
                    .format("YYYY-MM-DD HH:mm:ss")} WIB. Total dokumen diperbarui: ${result.modifiedCount}`
            );
        } else {
            console.warn(
                `Hanya ${result.modifiedCount} dari ${totalDocuments} dokumen yang berhasil direset. ` +
                `Periksa apakah ada dokumen yang bermasalah.`
            );
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat mereset data:', error.message);
    }
}

module.exports = { resetVoiceTimes };