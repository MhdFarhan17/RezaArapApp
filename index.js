const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { sendLeaderboard } = require('./logs/sendLeaderboard');
const { resetVoiceTimes } = require('./utils/resetVoiceTimes');
const { initializeVoiceTimes } = require('./events/voiceStateUpdate');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { logChannelChange } = require('./logs/moderationLog');
const { VoiceTime } = require('./utils/voiceTimes');
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const { server1, server2 } = require('./utils/constants');

if (!token) {
    console.error('Bot token tidak ditemukan! Pastikan DISCORD_TOKEN sudah diatur di file .env');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const boostedMembersCache = new Set();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (Array.isArray(event)) {
        event.forEach(event => {
            if (event.name && event.execute) {
                event.once
                    ? client.once(event.name, (...args) => event.execute(...args, client))
                    : client.on(event.name, (...args) => event.execute(...args, client));
            }
        });
    } else {
        if (event.name && event.execute) {
            event.once
                ? client.once(event.name, (...args) => event.execute(...args, client))
                : client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

client.once('ready', async () => {
    console.log('Bot Discord YB sudah ready!');

    [server1, server2].forEach(async (serverConfig) => {
        const guild = client.guilds.cache.get(serverConfig.guildId);
        if (!guild) {
            console.error(`Guild dengan ID ${serverConfig.guildId} tidak ditemukan.`);
            return;
        }

        const boostChannelId = serverConfig.boostChannelId;
        const boostChannel = guild.channels.cache.get(boostChannelId);
        if (!boostChannel) {
            console.error(`Boost notification channel dengan ID ${boostChannelId} tidak ditemukan.`);
            return;
        }

        const members = await guild.members.fetch();
        members.forEach((member) => {
            if (member.premiumSince && !boostedMembersCache.has(member.id)) {
                boostedMembersCache.add(member.id);
                const embed = new EmbedBuilder()
                    .setColor(0xFF73FA)
                    .setAuthor({ 
                        name: `${member.user.username}`, 
                        iconURL: member.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setDescription(
                        `Thank you **${member.user.username}**, for actively boosting the server!`
                    )
                    .addFields(
                        { name: 'Boost Active Since', value: `<t:${Math.floor(member.premiumSince / 1000)}:R>`, inline: true },
                        { name: 'Server', value: member.guild.name, inline: true }
                    )
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ 
                        text: 'Actively boosting the server! 🚀🚀🚀'
                    })
                    .setTimestamp();
        
                boostChannel.send({ embeds: [embed] });
            }
        });
    });

    const guild = client.guilds.cache.get(server1.guildId);
    if (!guild) {
        console.error(`Guild dengan ID ${server1.guildId} tidak ditemukan!`);
        return;
    }

    await initializeVoiceTimes(client);

    const leaderboardChannelId = server1.leaderboardChannelId;
    const leaderboardChannel = client.channels.cache.get(leaderboardChannelId);

    if (!leaderboardChannel) {
        console.error(`Leaderboard channel dengan ID ${leaderboardChannelId} tidak ditemukan!`);
        return;
    }

    // Kirim leaderboard pukul 00.00 WIB
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Mengirim leaderboard pada pukul 00.00 WIB...');
            await sendLeaderboard(client);
        } catch (error) {
            console.error(`Gagal mengirim leaderboard: ${error.message}`);
        }
    }, { timezone: "Asia/Jakarta" });

    // Notifikasi reset pukul 00.15 WIB
    cron.schedule('15 0 1 * *', async () => {
        try {
            if (leaderboardChannel) {
                await leaderboardChannel.send(
                    '⚠️ **Pemberitahuan Penting** ⚠️\n' +
                    'Data voice times akan di-reset pada pukul 00.30 WIB. Harap dicatat bahwa perhitungan waktu akan dimulai ulang setelah reset.'
                );
                console.log('Notifikasi reset terkirim.');
            }
        } catch (error) {
            console.error(`Gagal mengirim notifikasi reset: ${error.message}`);
        }
    }, { timezone: "Asia/Jakarta" });

    // Reset voiceTimes pukul 00.30 WIB dan mulai perhitungan ulang
    cron.schedule('30 0 1 * *', async () => {
        try {
            console.log('Mereset data voiceTimes pada pukul 00.30 WIB...');
            await resetVoiceTimes();

            console.log('Memulai perhitungan ulang untuk member yang aktif di voice channel...');
            const members = await guild.members.fetch();

            members.forEach(async (member) => {
                if (member.voice.channel && !member.voice.mute && !member.voice.deaf) {
                    const joinTime = Date.now();
                    await VoiceTime.updateOne(
                        { userId: member.id },
                        { joinTime, totalTime: 0 },
                        { upsert: true }
                    );
                    console.log(`Perhitungan ulang dimulai untuk member ${member.user.tag}.`);
                }
            });

            console.log('VoiceTimes data di-reset dan perhitungan ulang selesai.');
        } catch (error) {
            console.error(`Gagal mereset atau memulai ulang tracking: ${error.message}`);
        }
    }, { timezone: "Asia/Jakarta" });

    console.log('Semua jadwal telah diatur.');
});

// Event listener tetap sama, tidak ada perubahan
client.on('channelCreate', (channel) => {
    if (!channel.guild) return;

    try {
        const channelName = channel.name || 'Unknown';
        logChannelChange(client, channel.guild.id, 'Created', channel.id, channelName);
        console.log(`Channel '${channelName}' telah dibuat di server '${channel.guild.name}'.`);
    } catch (error) {
        console.error(`Error handling channelCreate: ${error.message}`);
    }
});

client.on('channelDelete', (channel) => {
    if (!channel.guild) return;

    try {
        const channelName = channel.name || 'Unknown';
        logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channelName);
        console.log(`Channel '${channelName}' telah dihapus dari server '${channel.guild.name}'.`);
    } catch (error) {
        console.error(`Error handling channelDelete: ${error.message}`);
    }
});

client.on('channelUpdate', (oldChannel, newChannel) => {
    if (!newChannel.guild) return;

    try {
        if (oldChannel.name !== newChannel.name) {
            const oldName = oldChannel.name || 'Unknown';
            const newName = newChannel.name || 'Unknown';
            logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldName, newName);
            console.log(`Channel '${oldName}' diubah menjadi '${newName}' di server '${newChannel.guild.name}'.`);
        }
    } catch (error) {
        console.error(`Error handling channelUpdate: ${error.message}`);
    }
});

client.login(token);