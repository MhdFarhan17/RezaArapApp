const { server1, server2, youtubeRegex, tiktokRegex, twitchRegex } = require('../utils/constants');

function getServerConfig(guildId) {
    return guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
}

function isAllowedLink(content) {
    return youtubeRegex.test(content) || tiktokRegex.test(content) || twitchRegex.test(content);
}

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
                sendWarning(message, `${message.author}, hanya link dari YouTube, TikTok, atau Twitch yang diperbolehkan di channel ini.`);
            }).catch(console.error);
        }
    }
};
