const { EmbedBuilder, Colors } = require('discord.js');
const { server1, server2 } = require('../utils/constants');

// Fungsi untuk mendapatkan konfigurasi server berdasarkan guild ID
function getServerConfig(guildId) {
    return guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
}

// Fungsi utama untuk mengirim log ke channel yang ditentukan
function sendLog(client, guildId, embed) {
    const serverConfig = getServerConfig(guildId);
    if (!serverConfig) return console.error(`Server config for guildId ${guildId} not found.`);
    
    const logChannel = client.channels.cache.get(serverConfig.moderationLogChannelId);
    if (!logChannel) return console.error(`Log channel with ID ${serverConfig.moderationLogChannelId} not found.`);
    
    logChannel.send({ embeds: [embed] }).catch(err => console.error(`Failed to send log: ${err.message}`));
}

module.exports = {
    // Log untuk aktivitas voice channel
    logVoiceChannelEvent(client, guildId, action, userId, channelIdFrom, channelIdTo = null) {
        const color = action.includes("Left") || action.includes("Remove") ? Colors.Red : Colors.Green;
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

        sendLog(client, guildId, embed);
    },

    // Log untuk penghapusan pesan
    async logMessageDelete(client, guildId, userId, channelId, messageContent) {
        const userMention = `<@${userId}>`;
        let channel = client.channels.cache.get(channelId);
        if (!channel) {
            channel = await client.channels.fetch(channelId).catch(() => null);
        }
        const channelMention = channel ? `<#${channel.id}>` : 'Unknown';

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('🗑️ Message Deleted')
            .addFields(
                { name: '👤 **User**', value: userMention, inline: false },
                { name: '🔊 **Channel**', value: channelMention, inline: false },
                { name: '📝 **Message**', value: messageContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    // Log untuk pengeditan pesan
    async logMessageEdit(client, guildId, userId, channelId, oldContent, newContent) {
        const userMention = `<@${userId}>`;
        let channel = client.channels.cache.get(channelId);
        if (!channel) {
            channel = await client.channels.fetch(channelId).catch(() => null);
        }
        const channelMention = channel ? `<#${channel.id}>` : 'Unknown';

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('✏️ Message Edited')
            .addFields(
                { name: '👤 **User**', value: userMention, inline: false },
                { name: '🔊 **Channel**', value: channelMention, inline: false },
                { name: '📥 **Old Text**', value: oldContent || '[Attachment/No Content]', inline: false },
                { name: '📤 **New Text**', value: newContent || '[Attachment/No Content]', inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    // Log untuk anggota yang bergabung
    logMemberJoin(client, guildId, userTag, userId) {
        const userMention = `<@${userId}>`;

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle('✅ Member Joined')
            .addFields(
                { name: '👤 **User**', value: userMention, inline: false },
                { name: '🔍 **Username**', value: userTag, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    // Log untuk anggota yang keluar
    logMemberLeave(client, guildId, userTag, userId) {
        const userMention = `<@${userId}>`;

        const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('❌ Member Left')
            .addFields(
                { name: '👤 **User**', value: userMention, inline: false },
                { name: '🔍 **Username**', value: userTag, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    // Log untuk perubahan role pada anggota
    logRoleChange(client, guildId, userTag, userId, roleName, action) {
        const userMention = `<@${userId}>`;

        const embed = new EmbedBuilder()
            .setColor(action === 'Added' ? Colors.Green : Colors.Red)
            .setTitle(`🔧 Role ${action}`)
            .addFields(
                { name: '👤 **User**', value: userMention, inline: false },
                { name: '🏷️ **Role**', value: roleName, inline: false }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    },

    // Log untuk perubahan pada channel
    logChannelChange(client, guildId, action, channelId, channelName) {
        // Tentukan warna berdasarkan jenis tindakan
        let color;
        if (action.toLowerCase() === 'deleted') {
            color = Colors.Red; // Warna merah untuk penghapusan channel
        } else if (action.toLowerCase() === 'created' || action.toLowerCase() === 'renamed') {
            color = Colors.Green; // Warna hijau untuk pembuatan dan penggantian nama channel
        } else {
            color = Colors.Blue; // Warna default untuk tindakan lainnya
        }

        const channelMention = `<#${channelId}> (${channelName || 'Unknown'})`;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`📁 Perubahan Channel: ${action}`)
            .addFields(
                { name: '🏷️ **Channel**', value: channelMention, inline: false },
                { name: '🛠️ **Tindakan**', value: action, inline: false }
            )
            .setFooter({ text: `Channel ID: ${channelId}` })
            .setTimestamp();

        sendLog(client, guildId, embed);
    }
};
