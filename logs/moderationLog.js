const { EmbedBuilder, Colors } = require('discord.js');
const { server1, server2 } = require('../utils/constants');

function getServerConfig(guildId) {
    return guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
}

function sendLog(client, guildId, embed, files = []) {
    const serverConfig = getServerConfig(guildId);
    if (!serverConfig) return console.error(`Server config for guildId ${guildId} not found.`);
    
    const logChannel = client.channels.cache.get(serverConfig.moderationLogChannelId);
    if (!logChannel) return console.error(`Log channel with ID ${serverConfig.moderationLogChannelId} not found.`);
    
    logChannel.send({ embeds: [embed], files }).catch(err => console.error(`Failed to send log: ${err.message}`));
}

module.exports = {
    logVoiceChannelEvent(client, guildId, action, userId, userTag, channelIdFrom, channelIdTo = null) {
        const color = action.includes("Left Voice Channel") || action.includes("Left") || action.includes("Remove") ? Colors.Red : Colors.Green;
        const userMention = `<@${userId}>`;
        const channelInfo = channelIdFrom && channelIdTo ? `<#${channelIdFrom}> to <#${channelIdTo}>`
                        : channelIdFrom ? `<#${channelIdFrom}>` : channelIdTo ? `<#${channelIdTo}>` : 'N/A';

        const user = client.users.cache.get(userId);

        const embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: 'Voice Channel Activity', iconURL: user ? user.displayAvatarURL({ dynamic: true }) : null })
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { value: action, inline: false },
                { name: '**User**', value: userMention, inline: false },
                { name: '**Channel**', value: channelInfo, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    async logMessageDelete(client, guildId, userId, userTag, channelId, messageContent) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);
        let channel = client.channels.cache.get(channelId);
        if (!channel) {
            channel = await client.channels.fetch(channelId).catch(() => null);
        }
        const channelMention = channel ? `<#${channel.id}>` : 'Unknown';

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: 'Message Deleted', iconURL: user ? user.displayAvatarURL({ dynamic: true }) : null })
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { name: '**User**', value: userMention, inline: false },
                { name: '**Channel**', value: channelMention, inline: false },
                { name: '**Message**', value: messageContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    async logMessageEdit(client, guildId, userId, userTag, channelId, oldContent, newContent) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);
        let channel = client.channels.cache.get(channelId);
        if (!channel) {
            channel = await client.channels.fetch(channelId).catch(() => null);
        }
        const channelMention = channel ? `<#${channel.id}>` : 'Unknown';

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setAuthor({ name: 'Message Edited', iconURL: user ? user.displayAvatarURL({ dynamic: true }) : null })
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { name: '**User**', value: userMention, inline: false },
                { name: '**Channel**', value: channelMention, inline: false },
                { name: '**Before**', value: oldContent || '[Attachment/No Content]', inline: false },
                { name: '**After**', value: newContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    logMemberJoin(client, guildId, userTag, userId, member) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);
        const accountCreatedAt = user ? user.createdAt : null;
        const now = new Date();
        const accountAgeInDays = Math.floor((now - accountCreatedAt) / (1000 * 60 * 60 * 24));

        const years = Math.floor(accountAgeInDays / 365);
        const months = Math.floor((accountAgeInDays % 365) / 30);
        const days = accountAgeInDays % 30;
    
        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({ name: '${userTag}', iconURL: user ? user.displayAvatarURL({ dynamic: true }) : null })
            .setTitle('Member Joined')
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { name: 'User', value: `${userMention} ${userTag}`, inline: false },
                { name: 'Account Age', value: `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}, ${days} day${days > 1 ? 's' : ''}`, inline: false }
            )
            .setFooter({ text: `Welcome to GITGUD || User ID: ${userId}` })
            .setTimestamp();
    
        sendLog(client, guildId, embed);
    },

    logMemberLeave(client, guildId, userTag, userId) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: '${userTag}', iconURL: user ? user.displayAvatarURL({ dynamic: true }) : null })
            .setTitle('Member Left')
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { name: '**User**', value: userMention, inline: false },
                { name: '**Username**', value: userTag, inline: false }
            )
            .setFooter({ text: `Selamat Tinggal 👋 || User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    logRoleChange(client, guildId, userTag, userId, roleName, roleId, action) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);
        const title = action === 'Added' ? 'Role Added' : 'Role Deleted';

        const embed = new EmbedBuilder()
            .setColor(action === 'Added' ? Colors.Green : Colors.Red)
            .setTitle(title)
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { name: '**User**', value: userMention, inline: false },
                { name: '**Role**', value: roleName, inline: false }
            )
            .setFooter({ text: `Role ID: ${roleId}` })
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