const { server1, server2 } = require('../utils/constants');
const { logMemberJoin, logRoleChange } = require('../logs/moderationLog');

const joinTimestamps = [];

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const guildId = member.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) return;

        const welcomeChannelId = serverConfig.welcomeChannelId;
        const antiRaidRoleId = serverConfig.antiRaidRoleId;
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        try {
            const user = await client.users.fetch(member.user.id);
            logMemberJoin(client, guildId, user.id, user.tag);

            joinTimestamps.push(Date.now());
            const recentJoins = joinTimestamps.filter(timestamp => Date.now() - timestamp < 60000);

            if (recentJoins.length > 5 && antiRaidRoleId) {
                await member.roles.add(antiRaidRoleId);
                console.log(`${user.tag} diberikan role Anti-Raid.`);
                logRoleChange(client, guildId, user.id, user.tag, 'Anti-Raid', 'Added');
            }

            if (welcomeChannel) {
                welcomeChannel.send(`Selamat datang, ${user.tag}! 🎉 Jangan lupa baca peraturan server.`)
                    .catch(console.error);
            } else {
                console.warn(`Welcome channel untuk guild ${guildId} tidak ditemukan.`);
            }
        } catch (error) {
            console.error(`Error during guildMemberAdd execution: ${error.message}`);
        }
    }
};
