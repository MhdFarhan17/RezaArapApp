const constants = require('../utils/constants');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const channel = oldState.channel;

        // Pastikan mendapatkan konfigurasi server berdasarkan ID guild
        const serverConfig = Object.values(constants).find(config => config.guildId === oldState.guild.id);
        if (!serverConfig) return;

        // Cek apakah channel adalah bagian dari kategori voice temporary dan tidak memiliki anggota
        if (channel && channel.members.size === 0 && channel.parentId === serverConfig.tempVoiceCategoryId) {
            // Tunggu 5 menit sebelum mencoba menghapus channel yang kosong
            setTimeout(async () => {
                // Cek ulang jika channel masih ada di cache setelah waktu tunggu
                const updatedChannel = oldState.guild.channels.cache.get(channel.id);
                
                // Hapus channel jika masih ada dan masih kosong
                if (updatedChannel && updatedChannel.members.size === 0) {
                    try {
                        await updatedChannel.delete();
                        console.log(`Temporary voice channel '${updatedChannel.name}' has been deleted due to inactivity.`);
                    } catch (error) {
                        console.error(`Failed to delete channel '${updatedChannel.name}':`, error);
                    }
                } else {
                    console.log(`Channel '${channel.name}' is no longer empty or has been deleted.`);
                }
            }, 300000); // 300000ms = 5 menit
        }
    },
};
