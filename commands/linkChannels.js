const { server1, server2, youtubeRegex, tiktokRegex, twitchRegex } = require('../utils/constants');
const { logModerationAction } = require('../logs/moderationLog');

module.exports = {
    handleLinkChannels(client, message) {
        const guildId = message.guild.id;
        const content = message.content.toLowerCase();

        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (serverConfig && serverConfig.linkOnlyChannelIds.includes(message.channel.id)) {
            const isValidLink = youtubeRegex.test(content) || tiktokRegex.test(content) || twitchRegex.test(content);

            if (!isValidLink) {
                message.delete().then(() => {
                    console.log(`Pesan dari ${message.author.tag} di channel khusus link telah dihapus karena bukan link yang diizinkan.`);
                    logModerationAction(client, guildId, 'Penghapusan Pesan di Channel Khusus Link', message.author.tag, message.author.id, message.channel.name, content);
                    message.channel.send(`${message.author}, hanya link dari YouTube, TikTok, atau Twitch yang diperbolehkan di channel ini.`)
                        .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                        .catch(console.error);
                }).catch(console.error);
            }
        }
    }
};