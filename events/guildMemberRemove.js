// Import konstanta dari constants.js
const { server1, server2 } = require('../utils/constants');

module.exports = {
    name: 'guildMemberRemove',
    execute(member, client) {
        // Tentukan konfigurasi server berdasarkan guildId
        const guildId = member.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) return;

        // Ambil goodbyeChannelId dari konfigurasi server yang sesuai
        const goodbyeChannelId = serverConfig.goodbyeChannelId;
        const goodbyeChannel = member.guild.channels.cache.get(goodbyeChannelId);

        // Kirim pesan perpisahan jika ada channel perpisahan yang ditentukan
        if (goodbyeChannel) {
            goodbyeChannel.send(`Selamat tinggal, ${member.user.tag}. Kami akan merindukanmu! 😢`)
                .catch(console.error);
        }
    }
};
