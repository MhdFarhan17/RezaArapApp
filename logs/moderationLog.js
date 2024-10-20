const { EmbedBuilder, Colors } = require('discord.js');

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

        let channelInfo = channelNameFrom && channelNameTo
            ? `${channelNameFrom} ke ${channelNameTo}`
            : channelNameFrom || channelNameTo;
        let color = action.includes("keluar") || action.includes("hapus") ? Colors.Red : Colors.Green;

        const embed = new EmbedBuilder()
            .setColor(color)  // Menggunakan predefined colors dari discord.js
            .setTitle('Moderation Action')
            .addFields([
                { name: 'Action', value: action },
                { name: 'User', value: `${userTag} (${userId})` },
                { name: 'Channel', value: channelInfo || 'N/A' },
                { name: 'Time', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }
            ])
            .setTimestamp();

        if (messageContent) {
            embed.addFields({ name: 'Message', value: messageContent });
        }

        logChannel.send({ embeds: [embed] }).catch(err => {
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

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)  // Menggunakan predefined colors dari discord.js
            .setTitle('Message Edited')
            .addFields([
                { name: 'User', value: `${userTag} (${userId})` },
                { name: 'Channel', value: channelName },
                { name: 'Old Content', value: oldContent || 'N/A' },
                { name: 'New Content', value: newContent || 'N/A' },
                { name: 'Time', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }
            ])
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => {
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

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)  // Menggunakan predefined colors dari discord.js
            .setTitle('Message Deleted')
            .addFields([
                { name: 'User', value: `${userTag} (${userId})` },
                { name: 'Channel', value: channelName },
                { name: 'Message', value: messageContent || 'N/A' },
                { name: 'Time', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }
            ])
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => {
            console.error(`Gagal mengirim log pesan dihapus ke channel moderation-log: ${err.message}`);
        });
    }
};
const { EmbedBuilder, Colors } = require('discord.js');

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

        let channelInfo = channelNameFrom && channelNameTo
            ? `${channelNameFrom} ke ${channelNameTo}`
            : channelNameFrom || channelNameTo;
        let color = action.includes("keluar") || action.includes("hapus") ? Colors.Red : Colors.Green;

        const embed = new EmbedBuilder()
            .setColor(color)  // Menggunakan predefined colors dari discord.js
            .setTitle('Moderation Action')
            .addFields([
                { name: 'Action', value: action },
                { name: 'User', value: `${userTag} (${userId})` },
                { name: 'Channel', value: channelInfo || 'N/A' },
                { name: 'Time', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }
            ])
            .setTimestamp();

        if (messageContent) {
            embed.addFields({ name: 'Message', value: messageContent });
        }

        logChannel.send({ embeds: [embed] }).catch(err => {
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

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)  // Menggunakan predefined colors dari discord.js
            .setTitle('Message Edited')
            .addFields([
                { name: 'User', value: `${userTag} (${userId})` },
                { name: 'Channel', value: channelName },
                { name: 'Old Content', value: oldContent || 'N/A' },
                { name: 'New Content', value: newContent || 'N/A' },
                { name: 'Time', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }
            ])
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => {
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

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)  // Menggunakan predefined colors dari discord.js
            .setTitle('Message Deleted')
            .addFields([
                { name: 'User', value: `${userTag} (${userId})` },
                { name: 'Channel', value: channelName },
                { name: 'Message', value: messageContent || 'N/A' },
                { name: 'Time', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }
            ])
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => {
            console.error(`Gagal mengirim log pesan dihapus ke channel moderation-log: ${err.message}`);
        });
    }
};