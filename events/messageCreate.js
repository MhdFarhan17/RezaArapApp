const { handleQuotes } = require('../commands/quotes');
const { handleResponses } = require('../commands/responses');
const { handleLinkChannels } = require('../commands/linkChannels');
const { handleMusicRequest } = require('../commands/music');
const { logMessageDelete } = require('../logs/moderationLog');
const { logChannelChange } = require('../logs/moderationLog');
const { sendLeaderboard } = require('../logs/sendLeaderboard');
const { ChannelType, PermissionsBitField } = require('discord.js');
const { server1, server2, bannedWords} = require('../utils/constants');

const userCreatedChannels = {};
const userMessages = {};
const userWarnings = {};
const SPAM_TIMEFRAME = 10000;
const SPAM_THRESHOLD = 2;
const WARNING_RESET_TIME = 15000;

function getServerConfig(guildId) {
    return [server1, server2].find(server => server.guildId === guildId);
}

function sendWarning(channel, content, timeout = 60000) {
    return channel.send(content)
        .then(sentMessage => setTimeout(() => sentMessage.delete().catch(console.error), timeout))
        .catch(console.error);
}

function isLink(content) {
    const urlPattern = /https?:\/\/[^\s]+/gi;
    const discordGifPattern = /https?:\/\/tenor\.com\/view\/[^\s]+|https?:\/\/media\.discordapp\.net\/attachments\/[^\s]+/gi; // Pengecualian untuk GIF Discord atau Tenor

    return urlPattern.test(content) && !discordGifPattern.test(content);
}

function containsBannedWords(content) {
    return bannedWords.some(word => content.includes(word));
}

async function handleSpamCheck(message, content) {
    const { author, channel } = message;
    const now = Date.now();

    if (!userMessages[author.id]) {
        userMessages[author.id] = [];
    }

    userMessages[author.id].push({ content, timestamp: now, messageId: message.id });
    userMessages[author.id] = userMessages[author.id].filter(msg => now - msg.timestamp < SPAM_TIMEFRAME);

    const identicalMessages = userMessages[author.id].filter(msg => msg.content === content);

    if (identicalMessages.length > SPAM_THRESHOLD) {
        try {
            for (let i = 2; i < identicalMessages.length; i++) {
                const msgToDelete = await channel.messages.fetch(identicalMessages[i].messageId).catch(err => {
                    if (err.code === 10008) {
                        console.warn('Tried to fetch or delete an unknown message. It may have already been deleted.');
                        return null;
                    }
                    throw err;
                });

                if (msgToDelete) {
                    await msgToDelete.delete().catch(err => {
                        if (err.code === 10008) {
                            console.warn('Message already deleted.');
                        } else {
                            console.error(`Failed to delete message: ${err.message}`);
                        }
                    });
                }
            }
        } catch (error) {
            console.error(`Error handling spam check: ${error.message}`);
        }

        if (!userWarnings[author.id] || now - userWarnings[author.id].lastWarningTime > WARNING_RESET_TIME) {
            sendWarning(channel, `${author}, Gausah SPAM ya tod 😡, ntar gua pukul pala lu!`);
            userWarnings[author.id] = { count: 1, lastWarningTime: now };
            logMessageDelete(message.client, message.guild.id, author.id, channel.id, content);
        }
    }
}

async function handleCreateVoiceChannel(message, serverConfig) {
    const { guild, author, content } = message;
    const args = content.split(' ').slice(1);

    if (args.length < 1) {
        return sendWarning(message.channel, "Format salah! Gunakan: `[cv! atau createvoice!] [Nama Channel atau NamaChannel] [maks anggota, opsional]`");
    }

    let maxMembers = parseInt(args[args.length - 1]);
    if (!isNaN(maxMembers)) {
        args.pop();
    } else {
        maxMembers = null;
    }

    if (args.length > 3) {
        return sendWarning(message.channel, "Nama channel maksimal hanya boleh terdiri dari 3 kata.");
    }

    const channelName = args.join(' ');
    const existingChannel = guild.channels.cache.find(
        ch => ch.name === channelName && ch.parentId === serverConfig.tempVoiceCategoryId
    );
    if (existingChannel) {
        return sendWarning(message.channel, `Channel dengan nama **${channelName}** sudah ada. Gunakan nama lain.`);
    }

    try {
        const voiceChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildVoice,
            parent: serverConfig.tempVoiceCategoryId,
            userLimit: maxMembers,
            permissionOverwrites: [
                { id: author.id, allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect] },
                { id: guild.roles.everyone.id, allow: [PermissionsBitField.Flags.Connect] }
            ]
        });

        userCreatedChannels[author.id] = voiceChannel.id;
        const limitMessage = maxMembers ? ` dengan batas maksimal ${maxMembers} anggota` : ' tanpa batasan anggota';
        message.reply(`Voice Channel **${channelName}** berhasil dibuat${limitMessage}!`);
        logChannelChange(message.client, guild.id, 'Created', voiceChannel.id, voiceChannel.name);

        const member = guild.members.cache.get(author.id);
        if (member.voice.channel) await member.voice.setChannel(voiceChannel);
    } catch (error) {
        console.error('Error saat membuat voice channel:', error);
        sendWarning(message.channel, 'Gagal membuat Voice Channel.');
    }
}

async function handleVoiceChannelLockUnlock(message) {
    const { author, content, member } = message;
    const voiceChannel = member.voice.channel;
    
    if (!voiceChannel || userCreatedChannels[author.id] !== voiceChannel.id) {
        return sendWarning(message.channel, 'Hanya pembuat yang bisa mengunci atau membuka Voice Channel ini.');
    }

    const isUnlock = content.startsWith('unlock!');
    try {
        await voiceChannel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: isUnlock });
        message.reply(`Voice Channel **${voiceChannel.name}** telah ${isUnlock ? 'dibuka' : 'dikunci'}.`);
    } catch (error) {
        console.error('Error saat mencoba mengubah akses voice channel:', error);
        sendWarning(message.channel, `Gagal ${isUnlock ? 'membuka' : 'mengunci'} Voice Channel.`);
    }
}

async function handleSetVoiceChannelLimit(message) {
    const { author, content, member } = message;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel || userCreatedChannels[author.id] !== voiceChannel.id) {
        return sendWarning(message.channel, 'Hanya pembuat yang bisa mengatur ulang batas pengguna Voice Channel ini.');
    }

    const limit = parseInt(content.split(' ')[1]);
    if (isNaN(limit) || limit < 0) {
        return sendWarning(message.channel, 'Masukkan batas pengguna yang valid (angka positif atau 0 untuk tidak terbatas).');
    }

    try {
        await voiceChannel.edit({ userLimit: limit });
        message.reply(`Batas pengguna Voice Channel **${voiceChannel.name}** diatur menjadi ${limit > 0 ? limit : 'tidak terbatas'}.`);
    } catch (error) {
        console.error('Error mengatur ulang batas pengguna:', error);
        sendWarning(message.channel, 'Gagal mengatur ulang batas pengguna Voice Channel.');
    }
}

async function handleSetVoiceChannelName(message) {
    const { author, content, member } = message;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel || userCreatedChannels[author.id] !== voiceChannel.id) {
        return sendWarning(message.channel, 'Hanya pembuat yang bisa mengubah nama Voice Channel ini.');
    }

    const oldName = voiceChannel.name;
    const newName = content.split(' ').slice(1).join(' ').trim();
    if (!newName) {
        return sendWarning(message.channel, 'Masukkan nama channel yang valid.');
    }

    try {
        await voiceChannel.edit({ name: newName });
        message.reply(`Nama Voice Channel berhasil diubah menjadi **${newName}**.`);
        logChannelChange(message.client, message.guild.id, 'Renamed', voiceChannel.id, `Before: ${oldName} → After: ${newName}`);
    } catch (error) {
        console.error('Error mengubah nama Voice Channel:', error);
        sendWarning(message.channel, 'Gagal mengubah nama Voice Channel.');
    }
}

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const content = message.content.toLowerCase();
        const { guild, channel } = message;
        const serverConfig = getServerConfig(guild.id);

        if (!serverConfig) return;

        const shareLinkChannelId = serverConfig.shareLinkChannelId;

        if (serverConfig.allowedChannelIds.includes(channel.id) && isLink(content)) {
            try {
                await message.delete();
                sendWarning(channel, `Gak boleh kirim link disini bro 🙏, kalau mau kirim link silahkan ke <#${shareLinkChannelId}>`);
            } catch (error) {
                console.error(`Failed to delete message or send warning: ${error.message}`);
            }
            return;
        }

        if (channel.id === serverConfig.leaderboardChannelId && content === 'leaderboard!') {
            console.log('Leaderboard Terkirim secara manual.');
            sendLeaderboard(client);
            return;
        }

        if (channel.id === serverConfig.commandChannelId) {
            const validCommands = ['cv!', 'createvoice!', 'lock!', 'unlock!', 'setlimit!', 'setname!'];
            if (!validCommands.some(cmd => content.startsWith(cmd))) {
                await message.delete().catch(console.error);
                sendWarning(channel, 'Channel ini hanya untuk perintah khusus: `createvoice!`, `lock!`, `unlock!`, `setlimit!`, dan `setname!`');
                return;
            }
        }

        await handleSpamCheck(message, content);

        if (content.startsWith('createvoice!') || content.startsWith('cv!')) {
            await handleCreateVoiceChannel(message, serverConfig);
            return;
        }

        if (content.startsWith('lock!') || content.startsWith('unlock!')) {
            await handleVoiceChannelLockUnlock(message);
            return;
        }

        if (content.startsWith('setlimit!')) {
            await handleSetVoiceChannelLimit(message);
            return;
        }

        if (content.startsWith('setname!')) {
            await handleSetVoiceChannelName(message);
            return;
        }

        if (serverConfig.linkOnlyChannelIds.includes(channel.id)) {
            handleLinkChannels(client, message);
            return;
        }

        if (containsBannedWords(content)) {
            await message.delete().catch(console.error);
            sendWarning(channel, `${message.author}, Pesan kamu mengandung kata yang tidak diperbolehkan dan telah dihapus. Mohon untuk menjaga tutur kata di server ini ya!`);
            return;
        }

        if (serverConfig.musicRequestChannelIds.includes(channel.id)) {
            handleMusicRequest(client, message);
            return;
        }

        if (serverConfig.allowedChannelIds.includes(channel.id)) {
            handleQuotes(message);
            handleResponses(message);
        }
    }
};