const { handleQuotes } = require('../commands/quotes');
const { handleResponses } = require('../commands/responses');
const { handleLinkChannels } = require('../commands/linkChannels');
const { handleMusicRequest } = require('../commands/music');
const { logModerationAction } = require('../logs/moderationLog');
const { sendLeaderboard } = require('../logs/sendLeaderboard');
const { ChannelType, PermissionsBitField } = require('discord.js');
const { server1, server2, youtubeRegex, spotifyRegex, tiktokRegex, twitchRegex, bannedWords } = require('../utils/constants');
const fs = require('fs');
const path = require('path');

const userMessages = {};
const userWarnings = {};
const LINK_SPAM_THRESHOLD = 2;
const LINK_SPAM_TIMEFRAME = 10000;
const SPAM_TIMEFRAME = 10000;
const SPAM_THRESHOLD = 1;
const MAX_WARNINGS = 1;

function resetVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    fs.writeFileSync(filePath, JSON.stringify({}, null, 4));
    console.log('Data Leaderboard VoiceTimes.json telah direset.');
}

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const content = message.content.toLowerCase();
        const userId = message.author.id;
        const guildId = message.guild.id;
        const now = Date.now();

        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
        if (!serverConfig) return;

        if (message.channel.id === serverConfig.leaderboardChannelId) {
            if (content === 'resetdata!') {
                resetVoiceTimes();
                message.channel.send('Data Leaderboard Terlama Voice telah direset.');
                return;
            }

            if (content === 'leaderboard!') {
                console.log('Leaderboard Terkirim secara manual.');
                sendLeaderboard(client);
                return;
            }
        }

        if (message.channel.id === serverConfig.commandChannelId) {
            if (!(content.startsWith('cv!') || content.startsWith('createvoice!') || content.startsWith('lock!') || content.startsWith('unlock!'))) {
                message.delete().catch(console.error);
                return message.reply(`Channel ini hanya untuk menggunakan perintah \`createvoice!\`, \`lock!\`, atau \`unlock!\`.`)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
        }

        if (content.startsWith('createvoice!') || content.startsWith('cv!')) {
            if (message.channel.id !== serverConfig.commandChannelId) {
                return message.reply(`Perintah ini hanya dapat digunakan di channel khusus: <#${serverConfig.commandChannelId}>.`)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            let args = message.content.trim().split(' ');
            args.shift();
            let channelName = args[0];
            let maxMembers = parseInt(args[1]);

            if (!channelName || channelName.trim() === '') {
                channelName = `${message.author.username}'s Channel`;
            }

            if (isNaN(maxMembers) || maxMembers <= 0) {
                maxMembers = null;
            }

            try {
                const channel = await message.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: serverConfig.tempVoiceCategoryId,
                    userLimit: maxMembers,
                    permissionOverwrites: [
                        {
                            id: message.author.id,
                            allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect],
                        },
                        {
                            id: message.guild.roles.everyone.id,
                            allow: [PermissionsBitField.Flags.Connect],
                        },
                    ],
                });

                const memberLimitMessage = maxMembers ? `dengan batasan maksimal ${maxMembers} anggota` : 'tanpa batasan anggota';
                message.reply(`Voice Channel dengan nama **${channelName}** berhasil dibuat ${memberLimitMessage}! Ayo join ke Voice tersebut.`)
                    .catch(console.error);

                const member = message.guild.members.cache.get(message.author.id);
                if (member && member.voice.channel) {
                    await member.voice.setChannel(channel);
                }
            } catch (error) {
                console.error("Error saat mencoba membuat voice channel:", error);
                message.reply('Terjadi kesalahan saat mencoba membuat Voice Channel.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
            return;
        }

        if (content.startsWith('lock!')) {
            if (!message.member.voice.channel) {
                return message.reply('Kamu harus berada di dalam Voice Channel yang ingin kamu kunci.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            const channel = message.member.voice.channel;

            try {
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    Connect: false,
                });
                message.reply(`Voice Channel dengan nama **${channel.name}** telah dikunci. Hanya kamu yang bisa mengundang pengguna lain.`)
                    .catch(console.error);
            } catch (error) {
                console.error('Error saat mencoba mengunci voice channel:', error);
                message.reply('Terjadi kesalahan saat mencoba mengunci Voice Channel.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
            return;
        }

        if (content.startsWith('unlock!')) {
            if (!message.member.voice.channel) {
                return message.reply('Kamu harus berada di dalam voice channel yang ingin kamu buka.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }

            const channel = message.member.voice.channel;

            try {
                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    Connect: true,
                });
                message.reply(`Voice Channel dengan nama **${channel.name}** telah dibuka kembali. Semua orang dapat bergabung.`)
                    .catch(console.error);
            } catch (error) {
                console.error('Error saat mencoba membuka voice channel:', error);
                message.reply('Terjadi kesalahan saat mencoba membuka Voice Channel.')
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
            }
            return;
        }

        if (serverConfig.linkOnlyChannelIds.includes(message.channel.id)) {
            console.log("Handling link channels");
            handleLinkChannels(client, message);
            return;
        }

        if (!userMessages[userId]) {
            userMessages[userId] = [];
        }

        userMessages[userId].push({ content, timestamp: now, messageId: message.id });
        userMessages[userId] = userMessages[userId].filter(msg => now - msg.timestamp < SPAM_TIMEFRAME);

        const identicalMessages = userMessages[userId].filter(msg => msg.content === content);

        if (identicalMessages.length > SPAM_THRESHOLD) {
            const messagesToDelete = identicalMessages.slice(0, -SPAM_THRESHOLD);
            messagesToDelete.forEach(msg => {
                message.channel.messages.fetch(msg.messageId)
                    .then(messageToDelete => messageToDelete.delete().catch(console.error))
                    .catch(console.error);
            });

            if (!userWarnings[userId]) {
                userWarnings[userId] = 0;
            }

            if (userWarnings[userId] < MAX_WARNINGS) {
                const warningMessage = `${message.author}, Gausah SPAM ya todd😠, tar gua pukul palalu.`;
                message.channel.send(warningMessage)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);

                userWarnings[userId]++;
                logModerationAction(client, guildId, 'Penghapusan Pesan Spam', message.author.tag, message.author.id, message.channel.name, content);
            }
        }

        const containsLink = youtubeRegex.test(content) || spotifyRegex.test(content) || tiktokRegex.test(content) || twitchRegex.test(content);

        if (containsLink) {
            if (!userMessages[userId]) {
                userMessages[userId] = [];
            }

            userMessages[userId].push(now);
            userMessages[userId] = userMessages[userId].filter(timestamp => now - timestamp < LINK_SPAM_TIMEFRAME);

            if (userMessages[userId].length > LINK_SPAM_THRESHOLD) {
                message.delete().then(() => {
                    const warningMessage = `${message.author}, kamu telah mengirim terlalu banyak link dalam waktu singkat. Mohon untuk tidak melakukan SPAM-Link ya todd!.`;
                    message.channel.send(warningMessage)
                        .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                        .catch(console.error);
                    logModerationAction(client, guildId, 'Penghapusan Pesan SPAM-Link', message.author.tag, message.author.id, message.channel.name, content);
                }).catch(console.error);
                userMessages[userId] = [];
                return;
            }
        }

        const containsBannedWord = bannedWords.some(word => content.includes(word));
        if (containsBannedWord) {
            message.delete().then(() => {
                const warningMessage = `${message.author}, Pesan kamu mengandung kata yang tidak diperbolehkan dan telah dihapus. Mohon untuk menjaga tutur kata di server ini ya!.`;
                message.channel.send(warningMessage)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
                logModerationAction(client, guildId, 'Penghapusan Pesan Kata Terlarang', message.author.tag, message.author.id, message.channel.name, content);
            }).catch(console.error);
            return;
        }

        if (serverConfig.musicRequestChannelIds.includes(message.channel.id)) {
            console.log("Handling music request channels");
            handleMusicRequest(client, message);
            return;
        }

        if (serverConfig.allowedChannelIds.includes(message.channel.id)) {
            handleQuotes(message);
            handleResponses(message);
        }
    }
};
