const { handleQuotes } = require('../commands/quotes');
const { handleResponses } = require('../commands/responses');
const { handleLinkChannels } = require('../commands/linkChannels');
const { handleMusicRequest } = require('../commands/music');
const { logMessageDelete } = require('../logs/moderationLog');
const { sendLeaderboard } = require('../logs/sendLeaderboard');
const { ChannelType, PermissionsBitField } = require('discord.js');
const { server1, server2, youtubeRegex, spotifyRegex, tiktokRegex, twitchRegex, bannedWords } = require('../utils/constants');

const userCreatedChannels = {};
const userMessages = {};
const userWarnings = {};
const LINK_SPAM_THRESHOLD = 2;
const LINK_SPAM_TIMEFRAME = 10000;
const SPAM_TIMEFRAME = 10000;
const SPAM_THRESHOLD = 1;
const MAX_WARNINGS = 1;

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const content = message.content.toLowerCase();
        const { guild, author, channel, member } = message;
        const serverConfig = guild.id === server1.guildId ? server1 : server2;
        const now = Date.now();

        if (!serverConfig) return;

        // Perintah untuk leaderboard
        if (channel.id === serverConfig.leaderboardChannelId) {
            if (content === 'leaderboard!') {
                console.log('Leaderboard Terkirim secara manual.');
                sendLeaderboard(client);
                return;
            }
        }

        // Hanya izinkan perintah tertentu di commandChannel
        if (channel.id === serverConfig.commandChannelId) {
            if (!['cv!', 'createvoice!', 'lock!', 'unlock!', 'setlimit!', 'setname!'].some(cmd => content.startsWith(cmd))) {
                await message.delete().catch(console.error);
                return message.reply('Channel ini hanya untuk perintah khusus: `createvoice!`, `lock!`, `unlock!`, `setlimit!`, dan `setname!`')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
        }

        // Perintah createvoice! untuk membuat channel sementara
        if (content.startsWith('createvoice!') || content.startsWith('cv!')) {
            let args = content.split(' ').slice(1);
            let channelName = args.join(' ').trim() || `${author.username}'s Channel`;
            let maxMembers = parseInt(args[1]) || null;

            try {
                const voiceChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: serverConfig.tempVoiceCategoryId,
                    userLimit: maxMembers,
                    permissionOverwrites: [
                        {
                            id: author.id,
                            allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect],
                        },
                        {
                            id: guild.roles.everyone.id,
                            allow: [PermissionsBitField.Flags.Connect],
                        },
                    ],
                });

                userCreatedChannels[author.id] = voiceChannel.id;

                const limitMsg = maxMembers ? ` dengan batas maksimal ${maxMembers} anggota` : ' tanpa batasan anggota';
                message.reply(`Voice Channel **${channelName}** berhasil dibuat${limitMsg}! Ayo join ke Voice tersebut.`)
                    .catch(console.error);

                const member = guild.members.cache.get(author.id);
                if (member.voice.channel) await member.voice.setChannel(voiceChannel);
            } catch (error) {
                console.error('Error saat membuat voice channel:', error);
                message.reply('Gagal membuat Voice Channel.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
            return;
        }

        // Perintah lock! dan unlock!
        if (content.startsWith('lock!') || content.startsWith('unlock!')) {
            const voiceChannel = member.voice.channel;
            if (!voiceChannel || userCreatedChannels[author.id] !== voiceChannel.id) {
                return message.reply('Hanya pembuat yang bisa mengunci atau membuka Voice Channel ini.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            try {
                const connectPermission = content.startsWith('unlock!') ? true : false;
                await voiceChannel.permissionOverwrites.edit(guild.roles.everyone, { Connect: connectPermission });
                const lockStatus = connectPermission ? 'dibuka' : 'dikunci';
                message.reply(`Voice Channel **${voiceChannel.name}** telah ${lockStatus}.`)
                    .catch(console.error);
            } catch (error) {
                console.error('Error saat mencoba mengubah akses voice channel:', error);
                message.reply(`Gagal ${content.startsWith('unlock!') ? 'membuka' : 'mengunci'} Voice Channel.`)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
            return;
        }

        // Perintah setlimit!
        if (content.startsWith('setlimit!')) {
            const voiceChannel = member.voice.channel;
            if (!voiceChannel || userCreatedChannels[author.id] !== voiceChannel.id) {
                return message.reply('Hanya pembuat yang bisa mengatur ulang batas pengguna Voice Channel ini.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            const limit = parseInt(content.split(' ')[1]);
            if (isNaN(limit) || limit < 0) {
                return message.reply('Masukkan batas pengguna yang valid (angka positif atau 0 untuk tidak terbatas).')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            try {
                await voiceChannel.edit({ userLimit: limit });
                message.reply(`Batas pengguna Voice Channel **${voiceChannel.name}** diatur menjadi ${limit > 0 ? limit : 'tidak terbatas'}.`)
                    .catch(console.error);
            } catch (error) {
                console.error('Error mengatur ulang batas pengguna:', error);
                message.reply('Gagal mengatur ulang batas pengguna Voice Channel.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
            return;
        }

        // Perintah setname!
        if (content.startsWith('setname!')) {
            const voiceChannel = member.voice.channel;
            if (!voiceChannel || userCreatedChannels[author.id] !== voiceChannel.id) {
                return message.reply('Hanya pembuat yang bisa mengubah nama Voice Channel ini.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            const newName = content.split(' ').slice(1).join(' ').trim();
            if (!newName) {
                return message.reply('Masukkan nama channel yang valid.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            try {
                await voiceChannel.edit({ name: newName });
                message.reply(`Nama Voice Channel berhasil diubah menjadi **${newName}**.`)
                    .catch(console.error);
            } catch (error) {
                console.error('Error mengubah nama Voice Channel:', error);
                message.reply('Gagal mengubah nama Voice Channel.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
        }

        // Cek pesan spam, link, atau kata terlarang
        if (serverConfig.linkOnlyChannelIds.includes(message.channel.id)) {
            console.log("Handling link channels");
            handleLinkChannels(client, message);
            return;
        }

        if (!userMessages[author.id]) {
            userMessages[author.id] = [];
        }

        userMessages[author.id].push({ content, timestamp: now, messageId: message.id });
        userMessages[author.id] = userMessages[author.id].filter(msg => now - msg.timestamp < SPAM_TIMEFRAME);

        const identicalMessages = userMessages[author.id].filter(msg => msg.content === content);

        if (identicalMessages.length > SPAM_THRESHOLD) {
            const messagesToDelete = identicalMessages.slice(0, -SPAM_THRESHOLD);
            messagesToDelete.forEach(msg => {
                message.channel.messages.fetch(msg.messageId)
                    .then(messageToDelete => messageToDelete.delete().catch(console.error))
                    .catch(console.error);
            });

            if (!userWarnings[author.id]) {
                userWarnings[author.id] = 0;
            }

            if (userWarnings[author.id] < MAX_WARNINGS) {
                const warningMessage = `${author}, Gausah SPAM ya todd😠, tar gua pukul palalu.`;
                message.channel.send(warningMessage)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);

                userWarnings[author.id]++;
                logMessageDelete(client, guild.id, 'Penghapusan Pesan Spam', author.tag, author.id, channel.name, content);
            }
        }

        const containsLink = youtubeRegex.test(content) || spotifyRegex.test(content) || tiktokRegex.test(content) || twitchRegex.test(content);

        if (containsLink) {
            if (!userMessages[author.id]) {
                userMessages[author.id] = [];
            }

            userMessages[author.id].push(now);
            userMessages[author.id] = userMessages[author.id].filter(timestamp => now - timestamp < LINK_SPAM_TIMEFRAME);

            if (userMessages[author.id].length > LINK_SPAM_THRESHOLD) {
                message.delete().then(() => {
                    const warningMessage = `${author}, kamu telah mengirim terlalu banyak link dalam waktu singkat. Mohon untuk tidak melakukan SPAM-Link ya todd!.`;
                    message.channel.send(warningMessage)
                        .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                        .catch(console.error);
                    }).catch(console.error);
                userMessages[author.id] = [];
                return;
            }
        }

        const containsBannedWord = bannedWords.some(word => content.includes(word));
        if (containsBannedWord) {
            message.delete().then(() => {
                const warningMessage = `${author}, Pesan kamu mengandung kata yang tidak diperbolehkan dan telah dihapus. Mohon untuk menjaga tutur kata di server ini ya!.`;
                message.channel.send(warningMessage)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
                }).catch(console.error);
            return;
        }

        if (serverConfig.musicRequestChannelIds.includes(channel.id)) {
            console.log("Handling music request channels");
            handleMusicRequest(client, message);
            return;
        }

        if (serverConfig.allowedChannelIds.includes(channel.id)) {
            handleQuotes(message);
            handleResponses(message);
        }
    }
}