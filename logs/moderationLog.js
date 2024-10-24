const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    logVoiceChannelEvent(client, guildId, action, userTag, userId, channelIdFrom, channelIdTo = null) {
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

        let color = action.includes(oldState.channel && !newState.channel) || action.includes("left") || action.includes("keluar") || action.includes("leave") ? Colors.Red : Colors.Green;

        const userMention = `<@${userId}>`;
        let channelInfo = '';
        if (channelIdFrom && channelIdTo) {
            channelInfo = `<#${channelIdFrom}> to <#${channelIdTo}>`;
        } else if (channelIdFrom) {
            channelInfo = `<#${channelIdFrom}>`;
        } else if (channelIdTo) {
            channelInfo = `<#${channelIdTo}>`;
        } else {
            channelInfo = 'N/A';
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('🎙️ Voice Channel Activity')
            .addFields(
                { name: '🛠 **Action**', value: `${action}`, inline: false },
                { name: '👤 **User**', value: userMention, inline: false },
                { name: '🔊 **Channel**', value: channelInfo || 'N/A', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Failed to send log to moderation-log channel: ${err.message}`);
        }
    },

    logMessageDelete(client, guildId, userTag, userId, channelName, messageContent) {
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

        const channelDisplay = channelName ? `<#${channelName}>` : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('🗑️ Message Deleted')
            .addFields(
                { name: '👤 **User**', value: `<@${userId}>`, inline: false },
                { name: '🔊 **Channel**', value: channelDisplay, inline: false },
                { name: '📝 **Message**', value: messageContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

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

        const channelDisplay = channelName ? `<#${channelName}>` : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('✏️ Message Edited')
            .addFields(
                { name: '👤 **User**', value: `<@${userId}>`, inline: false },
                { name: '🔊 **Channel**', value: channelDisplay, inline: false },
                { name: '📥 **Old Text**', value: oldContent ? oldContent : '[Attachment/No Content]', inline: false },
                { name: '📤 **New Text**', value: newContent ? newContent : '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Failed to send log to moderation-log channel: ${err.message}`);
        }
    }
};
