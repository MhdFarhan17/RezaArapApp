const { server1, server2, youtubeRegex, tiktokRegex, twitchRegex } = require('../utils/constants');
const { logModerationAction } = require('../logs/moderationLog');

// Helper function to get server configuration based on guild ID
function getServerConfig(guildId) {
    return guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
}

// Helper function to validate allowed links
function isAllowedLink(content) {
    return youtubeRegex.test(content) || tiktokRegex.test(content) || twitchRegex.test(content);
}

// Helper function to send warning messages with timeout
function sendWarning(message, warningText, timeout = 60000) {
    message.channel.send(warningText)
        .then(sentMessage => setTimeout(() => sentMessage.delete().catch(console.error), timeout))
        .catch(console.error);
}

module.exports = {
    handleLinkChannels(client, message) {
        const serverConfig = getServerConfig(message.guild.id);
        if (!serverConfig || !serverConfig.linkOnlyChannelIds.includes(message.channel.id)) return;

        const content = message.content.toLowerCase();
        if (!isAllowedLink(content)) {
            message.delete().then(() => {
                console.log(`Pesan dari ${message.author.tag} di channel khusus link telah dihapus karena bukan link yang diizinkan.`);
                logModerationAction(client, message.guild.id, 'Penghapusan Pesan di Channel Khusus Link', message.author.tag, message.author.id, message.channel.name, content);
                sendWarning(message, `${message.author}, hanya link dari YouTube, TikTok, atau Twitch yang diperbolehkan di channel ini.`);
            }).catch(console.error);
        }
    }
};
