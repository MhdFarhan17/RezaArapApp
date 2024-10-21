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

        // Tentukan warna berdasarkan jenis aksi
        let color;
        if (action.includes("keluar") || action.includes("hapus") || action.includes("leave") || action.includes("delete")) {
            color = Colors.Red;  // Warna merah untuk keluar voice, hapus pesan, keluar server, dll
        } else {
            color = Colors.Green;  // Warna hijau untuk masuk voice, buat channel, edit pesan, dll
        }

        let channelInfo = channelNameFrom && channelNameTo
            ? `${channelNameFrom} ke ${channelNameTo}`
            : channelNameFrom || channelNameTo;

        // Penggunaan embed dengan struktur yang lebih rapi dan mudah dibaca
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('📌 Moderation Action')
            .addFields(
                { name: '🛠 **Action**', value: `${action}`, inline: true },
                { name: '👤 **User**', value: `${userTag} (${userId})`, inline: true },
                { name: '🔊 **Channel**', value: `${channelInfo || 'N/A'}`, inline: true },
                { name: '🕒 **Time**', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }), inline: true },
                { name: '📝 **Message**', value: `${messageContent || 'N/A'}`, inline: true }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Gagal mengirim log ke channel moderation-log: ${err.message}`);
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
            .setColor(Colors.Green)  // Hijau untuk edit pesan
            .setTitle('✏️ Message Edited')
            .addFields(
                { name: '👤 **User**', value: `${userTag} (${userId})`, inline: true },
                { name: '🔊 **Channel**', value: `${channelDisplay}`, inline: true },
                { name: '🕒 **Time**', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }), inline: true },
                { name: '📥 **Old Text**', value: `${oldContent || 'N/A'}`, inline: true },
                { name: '📤 **New Text**', value: `${newContent || 'N/A'}`, inline: true }
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
            .setColor(Colors.Red)  // Merah untuk delete pesan
            .setTitle('🗑️ Message Deleted')
            .addFields(
                { name: '👤 **User**', value: `${userTag} (${userId})`, inline: true },
                { name: '🔊 **Channel**', value: `${channelDisplay}`, inline: true },
                { name: '🕒 **Time**', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }), inline: true },
                { name: '📝 **Message**', value: `${messageContent || 'N/A'}`, inline: true }
            )
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Gagal mengirim log pesan dihapus ke channel moderation-log: ${err.message}`);
        }
    },

    // Log voice channel join/leave/switch
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

        let color;
        if (action.includes("keluar") || action.includes("leave")) {
            color = Colors.Red;  // Merah untuk keluar voice channel
        } else {
            color = Colors.Green;  // Hijau untuk masuk voice channel
        }

        let channelInfo = channelNameFrom && channelNameTo
            ? `${channelNameFrom} ke ${channelNameTo}`
            : channelNameFrom || channelNameTo;

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('🎙️ Voice Channel Activity')
            .addFields(
                { name: '🛠 **Action**', value: `${action}`, inline: true },
                { name: '👤 **User**', value: `${userTag} (${userId})`, inline: true },
                { name: '🔊 **Channel**', value: `${channelInfo || 'N/A'}`, inline: true },
                { name: '🕒 **Time**', value: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }), inline: true }
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