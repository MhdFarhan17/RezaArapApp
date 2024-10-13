module.exports = {
    logModerationAction(client, guildId, action, userTag, userId, channelNameFrom, channelNameTo = null, messageContent = null) {
        const { server1, server2 } = require('../utils/constants');
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
    
        if (!serverConfig) {
            console.error(`Server config untuk guildId ${guildId} tidak ditemukan.`);
            return;
        }
    
        const logChannelId = serverConfig.moderationLogChannelId;
        if (!logChannelId) {
            console.error(`ID channel moderasi tidak ditemukan untuk server ${guildId}.`);
            return;
        }
    
        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.error(`Log channel dengan ID ${logChannelId} tidak ditemukan.`);
            return;
        }
    
        // Menggabungkan nama channel untuk pindah channel
        let channelInfo = channelNameFrom && channelNameTo 
            ? `${channelNameFrom} ke ${channelNameTo}`
            : channelNameFrom || channelNameTo;

        // Membuat log message
        const logMessage = `\`\`\`
Moderation Action
=================
Action  : ${action}
User    : ${userTag} (${userId})
Channel : ${channelInfo}
Time    : ${new Date().toLocaleString()}
${messageContent ? `Message : "${messageContent}"` : ''}
\`\`\``;

        // Mengirim log ke channel yang telah ditentukan
        logChannel.send(logMessage).catch(err => {
            console.error(`Gagal mengirim log ke channel moderation-log: ${err.message}`);
        });
    },

    logMessageEdit(client, guildId, userTag, userId, channelName, oldContent, newContent) {
        const { server1, server2 } = require('../utils/constants');
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) {
            console.error(`Server config untuk guildId ${guildId} tidak ditemukan.`);
            return;
        }

        const logChannelId = serverConfig.moderationLogChannelId;
        if (!logChannelId) {
            console.error(`ID channel moderasi tidak ditemukan untuk server ${guildId}.`);
            return;
        }

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.error(`Log channel dengan ID ${logChannelId} tidak ditemukan.`);
            return;
        }

        // Membuat log message untuk edit pesan
        const logMessage = `\`\`\`
Message Edited
==============
User    : ${userTag} (${userId})
Channel : ${channelName}
Time    : ${new Date().toLocaleString()}
Old     : "${oldContent}"
New     : "${newContent}"
\`\`\``;

        // Mengirim log ke channel yang telah ditentukan
        logChannel.send(logMessage).catch(err => {
            console.error(`Gagal mengirim log edit ke channel moderation-log: ${err.message}`);
        });
    },

    logMessageDelete(client, guildId, userTag, userId, channelName, messageContent) {
        const { server1, server2 } = require('../utils/constants');
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) {
            console.error(`Server config untuk guildId ${guildId} tidak ditemukan.`);
            return;
        }

        const logChannelId = serverConfig.moderationLogChannelId;
        if (!logChannelId) {
            console.error(`ID channel moderasi tidak ditemukan untuk server ${guildId}.`);
            return;
        }

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.error(`Log channel dengan ID ${logChannelId} tidak ditemukan.`);
            return;
        }

        // Membuat log message untuk pesan yang dihapus
        const logMessage = `\`\`\`
Moderation Action
=================
Action  : Pesan Dihapus
User    : ${userTag} (${userId})
Channel : ${channelName}
Time    : ${new Date().toLocaleString()}
Message : "${messageContent}"
\`\`\``;

        // Mengirim log ke channel yang telah ditentukan
        logChannel.send(logMessage).catch(err => {
            console.error(`Gagal mengirim log pesan dihapus ke channel moderation-log: ${err.message}`);
        });
    }
};
