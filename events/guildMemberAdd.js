const { server1, server2 } = require('../utils/constants');
const { logMemberJoin, logRoleChange } = require('../logs/moderationLog'); // Import fungsi log

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

        // Log anggota yang bergabung
        logMemberJoin(client, guildId, member.user.tag, member.user.id);

        joinTimestamps.push(Date.now());

        const recentJoins = joinTimestamps.filter(timestamp => Date.now() - timestamp < 60000);

        if (recentJoins.length > 5 && antiRaidRoleId) {
            member.roles.add(antiRaidRoleId)
                .then(() => {
                    console.log(`${member.user.tag} diberikan role Anti-Raid.`);
                    logRoleChange(client, guildId, member.user.tag, member.user.id, 'Anti-Raid', 'Added');
                })
                .catch(console.error);
        }

        if (welcomeChannel) {
            welcomeChannel.send(`Selamat datang, ${member.user.tag}! 🎉 Jangan lupa baca peraturan server.`)
                .catch(console.error);
        }
    }
};
