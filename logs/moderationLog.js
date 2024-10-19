const { MessageEmbed } = require('discord.js');

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
        let color = action.includes("keluar") || action.includes("hapus") ? 'RED' : 'GREEN';

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle('Moderation Action')
            .addField('Action', action)
            .addField('User', `${userTag} (${userId})`)
            .addField('Channel', channelInfo || 'N/A')
            .addField('Time', new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }))
            .setTimestamp();

        if (messageContent) {
            embed.addField('Message', messageContent);
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

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Message Edited')
            .addField('User', `${userTag} (${userId})`)
            .addField('Channel', channelName)
            .addField('Old Content', oldContent || 'N/A')
            .addField('New Content', newContent || 'N/A')
            .addField('Time', new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }))
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

        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Message Deleted')
            .addField('User', `${userTag} (${userId})`)
            .addField('Channel', channelName)
            .addField('Message', messageContent || 'N/A')
            .addField('Time', new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }))
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => {
            console.error(`Gagal mengirim log pesan dihapus ke channel moderation-log: ${err.message}`);
        });
    }
};
