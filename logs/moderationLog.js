const { EmbedBuilder, Colors } = require('discord.js');
const { server1, server2 } = require('../utils/constants');

function getServerConfig(guildId) {
    return guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
}

function sendLog(client, guildId, embed, files = []) {
    const serverConfig = getServerConfig(guildId);
    if (!serverConfig || !serverConfig.moderationLogChannelId) {
        console.error(`Server config or log channel ID for guildId ${guildId} not found.`);
        return;
    }

    const logChannel = client.channels.cache.get(serverConfig.moderationLogChannelId);
    if (!logChannel) {
        console.error(`Log channel with ID ${serverConfig.moderationLogChannelId} not found.`);
        return;
    }

    logChannel.send({ embeds: [embed], files }).catch(err => console.error(`Failed to send log: ${err.message}`));
}

module.exports = {
    logVoiceChannelEvent(client, guildId, action, userId, channelIdFrom, channelIdTo = null) {
        const user = client.users.cache.get(userId);
        const userMention = `<@${userId}>`;
        const channelInfo = channelIdFrom && channelIdTo
            ? `<#${channelIdFrom}> to <#${channelIdTo}>`
            : channelIdFrom ? `<#${channelIdFrom}>` : channelIdTo ? `<#${channelIdTo}>` : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(action.includes("Left") || action.includes("Remove") ? Colors.Red : Colors.Green)
            .setTitle('Voice Channel Event')
            .setAuthor({ name: user?.tag || 'Unknown User', iconURL: user?.displayAvatarURL({ dynamic: true }) || null })
            .setThumbnail(user?.displayAvatarURL({ dynamic: true }) || null)
            .addFields(
                { name: '**Action**', value: action, inline: true },
                { name: '**User**', value: userMention, inline: true },
                { name: '**Channel**', value: channelInfo, inline: true }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    async logMessageDelete(client, guildId, userId, channelId, messageContent, attachments = []) {
        const user = client.users.cache.get(userId);
        const userMention = `<@${userId}>`;
        const channel = client.channels.cache.get(channelId);
        const files = attachments.map(attachment => ({ attachment: attachment.url, name: attachment.name }));

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('Message Deleted')
            .setAuthor({ name: user?.tag || 'Unknown User', iconURL: user?.displayAvatarURL({ dynamic: true }) || null })
            .setThumbnail(user?.displayAvatarURL({ dynamic: true }) || null)
            .addFields(
                { name: '**User**', value: userMention, inline: true },
                { name: '**Channel**', value: channel ? `<#${channel.id}>` : 'Unknown', inline: true },
                { name: '**Message Content**', value: messageContent || '[No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed, files);
    },

    async logMessageEdit(client, guildId, userId, channelId, oldContent, newContent, attachments = []) {
        const user = client.users.cache.get(userId);
        const userMention = `<@${userId}>`;
        const channel = client.channels.cache.get(channelId);
        const files = attachments.map(attachment => ({ attachment: attachment.url, name: attachment.name }));

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle('Message Edited')
            .setAuthor({ name: user?.tag || 'Unknown User', iconURL: user?.displayAvatarURL({ dynamic: true }) || null })
            .setThumbnail(user?.displayAvatarURL({ dynamic: true }) || null)
            .addFields(
                { name: '**User**', value: userMention, inline: true },
                { name: '**Channel**', value: channel ? `<#${channel.id}>` : 'Unknown', inline: true },
                { name: '**Old Content**', value: oldContent || '[No Content]', inline: false },
                { name: '**New Content**', value: newContent || '[No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed, files);
    },

    logMemberJoin(client, guildId, userId, userTag) {
        const user = client.users.cache.get(userId);
        const userMention = `<@${userId}>`;

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('Member Joined')
            .setAuthor({ name: user?.tag || userTag, iconURL: user?.displayAvatarURL({ dynamic: true }) || null })
            .setThumbnail(user?.displayAvatarURL({ dynamic: true }) || null)
            .addFields(
                { name: '**User**', value: `${userMention} (${userTag})`, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    logMemberLeave(client, guildId, userId, userTag) {
        const user = client.users.cache.get(userId);
        const userMention = `<@${userId}>`;

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('Member Left')
            .setAuthor({ name: user?.tag || userTag, iconURL: user?.displayAvatarURL({ dynamic: true }) || null })
            .setThumbnail(user?.displayAvatarURL({ dynamic: true }) || null)
            .addFields(
                { name: '**User**', value: `${userMention} (${userTag})`, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    logRoleChange(client, guildId, userId, roleName, action) {
        const user = client.users.cache.get(userId);
        const userMention = `<@${userId}>`;

        const embed = new EmbedBuilder()
            .setColor(action === 'Added' ? Colors.Green : Colors.Red)
            .setTitle(`Role ${action}`)
            .setAuthor({ name: user?.tag || 'Unknown User', iconURL: user?.displayAvatarURL({ dynamic: true }) || null })
            .setThumbnail(user?.displayAvatarURL({ dynamic: true }) || null)
            .addFields(
                { name: '**User**', value: userMention, inline: true },
                { name: '**Role**', value: roleName, inline: true }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    logChannelChange(client, guildId, action, channelId, channelNameBefore = null, channelNameAfter = null) {
        let color;

        switch (action.toLowerCase()) {
            case 'deleted':
                color = Colors.Red;
                break;
            case 'created':
                color = Colors.Green;
                break;
            case 'renamed':
                color = Colors.Blue;
                break;
            default:
                color = Colors.Grey;
        }

        const guild = client.guilds.cache.get(guildId);
    
        if (!guild) {
            console.error(`Guild dengan ID ${guildId} tidak ditemukan.`);
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`Channel ${action.charAt(0).toUpperCase() + action.slice(1)}`)
            .setFooter({ text: `Channel ID: ${channelId}` })
            .setTimestamp();

        embed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL({ dynamic: true }) || undefined
        });

        if (action.toLowerCase() === 'renamed') {
            embed.addFields(
                { name: '**Old Name**', value: channelNameBefore || 'Unknown', inline: true },
                { name: '**New Name**', value: channelNameAfter || 'Unknown', inline: true }
            );
        }

        else {
            embed.addFields(
                { name: '**Channel Name**', value: channelNameBefore || 'Unknown', inline: false }
            );
        }

        sendLog(client, guildId, embed);
    }    
};