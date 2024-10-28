const { EmbedBuilder, Colors } = require('discord.js');
const { server1, server2 } = require('../utils/constants');

function getServerConfig(guildId) {
    return guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
}

module.exports = {
    logVoiceChannelEvent(client, guildId, action, userTag, userId, channelIdFrom, channelIdTo = null) {
        const serverConfig = getServerConfig(guildId);
        if (!serverConfig) return console.error(`Server config for guildId ${guildId} not found.`);

        const logChannel = client.channels.cache.get(serverConfig.moderationLogChannelId);
        if (!logChannel) return console.error(`Log channel with ID ${serverConfig.moderationLogChannelId} not found.`);

        const color = action.includes("left") || action.includes("leave") || action.includes("Member Left Voice Channel") ? Colors.Red : Colors.Green;
        const userMention = `<@${userId}>`;
        const channelInfo = channelIdFrom && channelIdTo ? `<#${channelIdFrom}> to <#${channelIdTo}>`
                            : channelIdFrom ? `<#${channelIdFrom}>` : channelIdTo ? `<#${channelIdTo}>` : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('🎙️ Voice Channel Activity')
            .addFields(
                { name: '🛠 **Action**', value: action, inline: false },
                { name: '👤 **User**', value: userMention, inline: false },
                { name: '🔊 **Channel**', value: channelInfo, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => console.error(`Failed to send log: ${err.message}`));
    },

    logMessageDelete(client, guildId, userTag, userId, channelName, messageContent) {
        const serverConfig = getServerConfig(guildId);
        if (!serverConfig) return console.error(`Server config for guildId ${guildId} not found.`);

        const logChannel = client.channels.cache.get(serverConfig.moderationLogChannelId);
        if (!logChannel) return console.error(`Log channel with ID ${serverConfig.moderationLogChannelId} not found.`);

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('🗑️ Message Deleted')
            .addFields(
                { name: '👤 **User**', value: `<@${userId}>`, inline: false },
                { name: '🔊 **Channel**', value: `<#${channelName}>`, inline: false },
                { name: '📝 **Message**', value: messageContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => console.error(`Failed to send log: ${err.message}`));
    },

    logMessageEdit(client, guildId, userTag, userId, channelName, oldContent, newContent) {
        const serverConfig = getServerConfig(guildId);
        if (!serverConfig) return console.error(`Server config for guildId ${guildId} not found.`);

        const logChannel = client.channels.cache.get(serverConfig.moderationLogChannelId);
        if (!logChannel) return console.error(`Log channel with ID ${serverConfig.moderationLogChannelId} not found.`);

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('✏️ Message Edited')
            .addFields(
                { name: '👤 **User**', value: `<@${userId}>`, inline: false },
                { name: '🔊 **Channel**', value: `<#${channelName}>`, inline: false },
                { name: '📥 **Old Text**', value: oldContent || '[Attachment/No Content]', inline: false },
                { name: '📤 **New Text**', value: newContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(err => console.error(`Failed to send log: ${err.message}`));
    }
};
