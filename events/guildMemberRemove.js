const { server1, server2 } = require('../utils/constants');

module.exports = {
    name: 'guildMemberRemove',
    execute(member, client) {
        const guildId = member.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) return;

        const goodbyeChannelId = serverConfig.goodbyeChannelId;
        const goodbyeChannel = member.guild.channels.cache.get(goodbyeChannelId);

        if (goodbyeChannel) {
            goodbyeChannel.send(`Selamat tinggal, ${member.user.tag}. Kami akan merindukanmu! 😢`)
                .catch(console.error);
        }
    }
};
