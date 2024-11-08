// voiceChannelDelete.js
const { logChannelChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const channel = oldState.channel;
        const guildId = oldState.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) return;

        // Hanya jalankan jika channel kosong dan channel adalah voice channel sementara
        if (channel && channel.members.size === 0 && channel.parentId === serverConfig.tempVoiceCategoryId) {
            console.log(`Channel '${channel.name}' kosong. Memulai timer penghapusan 5 menit...`);
            setTimeout(async () => {
                const updatedChannel = oldState.guild.channels.cache.get(channel.id);

                if (updatedChannel && updatedChannel.members.size === 0) {
                    try {
                        await updatedChannel.delete();
                        console.log(`Temporary voice channel '${updatedChannel.name}' telah dihapus karena tidak ada aktivitas.`);
                        logChannelChange(oldState.client, guildId, 'Deleted', updatedChannel.name, updatedChannel.id);
                    } catch (error) {
                        console.error(`Gagal menghapus channel '${updatedChannel.name}':`, error);
                    }
                } else {
                    console.log(`Channel '${channel.name}' tidak kosong atau sudah dihapus.`);
                }
            }, 300000); // 5 menit (300000 ms)
        }
    },
};
