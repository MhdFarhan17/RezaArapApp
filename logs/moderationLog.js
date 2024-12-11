const { EmbedBuilder, Colors } = require('discord.js');
const { server1, server2 } = require('../utils/constants');
const path = require('path'); // Tambahkan modul path untuk mengelola file

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
    logVoiceChannelEvent(client, guildId, action, userId, channelIdFrom, channelIdTo = null) {
        const color = action.includes("Left Voice Channel") || action.includes("Left") || action.includes("Remove") ? Colors.Red : Colors.Green;
        const userMention = `<@${userId}>`;
        const channelInfo = channelIdFrom && channelIdTo ? `<#${channelIdFrom}> to <#${channelIdTo}>`
                        : channelIdFrom ? `<#${channelIdFrom}>` : channelIdTo ? `<#${channelIdTo}>` : 'N/A';

        const user = client.users.cache.get(userId);

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Voice Channel Activity')
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { name: '**Action**', value: action, inline: false },
                { name: '**User**', value: userMention, inline: false },
                { name: '**Channel**', value: channelInfo, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    async logMessageDelete(client, guildId, userId, channelId, messageContent) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);
        let channel = client.channels.cache.get(channelId);
        if (!channel) {
            channel = await client.channels.fetch(channelId).catch(() => null);
        }
        const channelMention = channel ? `<#${channel.id}>` : 'Unknown';

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('Message Deleted')
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

    async logMessageEdit(client, guildId, userId, channelId, oldContent, newContent) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);
        let channel = client.channels.cache.get(channelId);
        if (!channel) {
            channel = await client.channels.fetch(channelId).catch(() => null);
        }
        const channelMention = channel ? `<#${channel.id}>` : 'Unknown';

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle('Message Edited')
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

    logMemberJoin(client, guildId, userTag, userId) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('Member Joined')
            .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : null)
            .addFields(
                { name: '**User**', value: userMention, inline: false },
                { name: '**Username**', value: userTag, inline: false }
            )
            .setImage('attachment://welcomemember.gif') // Tambahkan GIF di bagian embed
            .setFooter({ text: `Welcome to GITGUD || User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed, [
            { attachment: path.join(__dirname, '../gifs', 'welcomemember.gif'), name: 'welcomemember.gif' }
        ]);
    },

    logMemberLeave(client, guildId, userTag, userId) {
        const userMention = `<@${userId}>`;
        const user = client.users.cache.get(userId);

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
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
        const title = action === 'Added' ? 'Role Ditambahkan' : 'Role Dihapus';

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
        if (action.toLowerCase() === 'deleted') {
            color = Colors.Red;
        } else if (action.toLowerCase() === 'created') {
            color = Colors.Green;
        } else {
            color = Colors.Blue;
        }
    
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`Channel ${action.charAt(0).toUpperCase() + action.slice(1)}`)
            .setFooter({ text: `Channel ID: ${channelId}` })
            .setTimestamp();
    
        if (action.toLowerCase() === 'renamed') {
            embed.addFields(
                { name: '**Before**', value: channelNameBefore || 'Unknown', inline: false },
                { name: '**After**', value: channelNameAfter || 'Unknown', inline: false }
            );
        } else {
            embed.addFields(
                { name: '**Channel**', value: channelNameBefore || 'Unknown', inline: false }
            );
        }
    
        sendLog(client, guildId, embed);
    }
};