const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    logModerationAction(client, guildId, action, userTag, userId, channelNameFrom, channelNameTo = null, messageContent = null) {
        const { server1, server2 } = require('../utils/constants');
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) {
            console.error(`Server config for guildId ${guildId} not found.`);
            return;
        }

        const logChannelId = serverConfig.moderationLogChannelId;
        if (!logChannelId) {
            console.error(`Moderation log channel ID not found for guild ${guildId}.`);
            return;
        }

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) {
            console.error(`Log channel with ID ${logChannelId} not found.`);
            return;
        }

        let color = action.includes("left") || action.includes("keluar") || action.includes("leave") ? Colors.Red : Colors.Green;

        let channelInfo = channelNameFrom && channelNameTo ? `${channelNameFrom} ke ${channelNameTo}` : channelNameFrom || channelNameTo;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Moderation Action')
            .addFields(
                { name: '🛠 **Action**', value: `${action}`, inline: false },
                { name: '👤 **User**', value: `@${userTag}`, inline: false },
                { name: '🔊 **Channel**', value: `${channelInfo || 'N/A'}`, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        if (messageContent) {
            embed.addFields({ name: '📝 **Message**', value: messageContent || '[Attachment/No Content]', inline: false });
        }

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Failed to send log to moderation-log channel: ${err.message}`);
        }
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

        const channelDisplay = channelName ? `<#${channelName}>` : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('✏️ Message Edited')
            .addFields(
                { name: '👤 **User**', value: `@${userTag}`, inline: false },
                { name: '🔊 **Channel**', value: `${channelDisplay}`, inline: false },
                { name: '📥 **Old Text**', value: oldContent ? oldContent : '[Attachment/No Content]', inline: false },  // Old message content
                { name: '📤 **New Text**', value: newContent ? newContent : '[Attachment/No Content]', inline: false }  // New message content
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Gagal mengirim log edit ke channel moderation-log: ${err.message}`);
        }
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

        const channelDisplay = channelName ? `<#${channelName}>` : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)  // Red for message deletions
            .setTitle('🗑️ Message Deleted')
            .addFields(
                { name: '👤 **User**', value: `@${userTag}`, inline: false },
                { name: '🔊 **Channel**', value: `${channelDisplay}`, inline: false },
                { name: '📝 **Message**', value: messageContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Gagal mengirim log pesan dihapus ke channel moderation-log: ${err.message}`);
        }
    },

    logVoiceChannelEvent(client, guildId, action, userTag, userId, channelNameFrom, channelNameTo = null) {
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
    
        // Ubah logika warna di sini
        let color;
        if (action.includes("left") || action.includes("keluar") || action.includes("leave") || action.includes("Left Voice Channel")) {
            color = Colors.Red; // Merah untuk left/keluar voice channel
        } else {
            color = Colors.Green; // Hijau untuk join voice channel
        }
    
        let channelInfo = channelNameFrom && channelNameTo ? `${channelNameFrom} ke ${channelNameTo}` : channelNameFrom || channelNameTo;
    
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('🎙️ Voice Channel Activity')
            .addFields(
                { name: '🛠 **Action**', value: `${action}`, inline: false },
                { name: '👤 **User**', value: `@${userTag}`, inline: false },
                { name: '🔊 **Channel**', value: `${channelInfo || 'N/A'}`, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();
    
        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Gagal mengirim log voice channel ke channel moderation-log: ${err.message}`);
        }
    }
    
};