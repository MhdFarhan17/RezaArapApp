const { server1, server2 } = require('../utils/constants');
const { logModerationAction } = require('../logs/moderationLog');

const joinTimestamps = [];

module.exports = {
    name: 'guildMemberAdd',
    execute(member, client) {
        const guildId = member.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) return;

        const welcomeChannelId = serverConfig.welcomeChannelId;
        const antiRaidRoleId = serverConfig.antiRaidRoleId;

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        joinTimestamps.push(Date.now());

        const recentJoins = joinTimestamps.filter(timestamp => Date.now() - timestamp < 60000);

        if (recentJoins.length > 5 && antiRaidRoleId) {
            member.roles.add(antiRaidRoleId)
                .then(() => {
                    console.log(`${member.user.tag} diberikan role Anti-Raid.`);
                    logModerationAction(client, guildId, 'Anti-Raid Role Assigned', member.user.tag, member.user.id, 'N/A');
                })
                .catch(console.error);
        }

        if (welcomeChannel) {
            welcomeChannel.send(`Selamat datang, ${member.user.tag}! 🎉 Jangan lupa baca peraturan server.`)
                .catch(console.error);
        }
    }
};

