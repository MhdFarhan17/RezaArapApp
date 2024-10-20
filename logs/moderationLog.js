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

        const channelDisplay = channelNameFrom ? `<#${channelNameFrom}>` : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle('Moderation Action')
            .setDescription(`
                **Action**	: ${action}
                **User**	: ${userTag} (${userId})
                **Channel**	: ${channelDisplay}
                **Time**	: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
                **Message**	: ${messageContent || 'N/A'}

            `)
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
            .setTitle('Message Edited')
            .setDescription(`
                **User**	: ${userTag} (${userId})
                **Channel**	: ${channelDisplay}
                **Time**	: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
                **OldText**	: ${oldContent || 'N/A'}
                **NewText**	: ${newContent || 'N/A'}

            `)
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
            .setTitle('Message Deleted')
            .setDescription(`
                **User**	: ${userTag} (${userId})
                **Channel**	: ${channelDisplay}
                **Time**	: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
                **Message**	: ${messageContent || 'N/A'}

            `)
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Gagal mengirim log pesan dihapus ke channel moderation-log: ${err.message}`);
        }
    },

    // Tambahan log untuk event lainnya seperti voice channel
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
            .setTitle('Voice Channel Activity')
            .setDescription(`
                **Action**	: ${action}
                **User**	: ${userTag} (${userId})
                **Channel**	: ${channelInfo || 'N/A'}
                **Time**	: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
            `)
            .setFooter({ text: `User ID: ${userId}` })
            .setTimestamp();

        try {
            logChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error(`Gagal mengirim log voice channel ke channel moderation-log: ${err.message}`);
        }
    }
};