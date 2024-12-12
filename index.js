const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { sendLeaderboard } = require('./logs/sendLeaderboard');
const { initializeVoiceTimes } = require('./events/voiceStateUpdate');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { logChannelChange } = require('./logs/moderationLog');
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
                        name: `${member.user.username} actively boosting the server! 🚀`, 
                        iconURL: member.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setDescription(
                        `**Thank you, ${member.user.username}, for boosting the server!**\n` +
                        `Your support helps us grow and keep the community awesome!`
                    )
                    .addFields(
                        { name: 'Boost Active Since', value: `<t:${Math.floor(member.premiumSince / 1000)}:R>`, inline: true },
                        { name: 'Server', value: member.guild.name, inline: true }
                    )
                    .setThumbnail('https://tenor.com/pzNNdrPTVgw.gif')
                    .setFooter({ 
                        text: 'We appreciate your support!', 
                        iconURL: 'https://tenor.com/r4ly3icb790.gif'
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

    const allowedChannelId = server1.allowedChannelIds[0];
    const allowedChannel = guild.channels.cache.get(allowedChannelId);
    if (!allowedChannel) {
        console.error(`Allowed channel dengan ID ${allowedChannelId} tidak ditemukan!`);
        return;
    }

    const leaderboardChannelId = server1.leaderboardChannelId;
    const leaderboardChannel = guild.channels.cache.get(leaderboardChannelId);
    if (!leaderboardChannel) {
        console.error(`Leaderboard channel dengan ID ${leaderboardChannelId} tidak ditemukan!`);
        return;
    }

    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Sending daily leaderboard at 00.00 WIB ...');
            await sendLeaderboard(client);
        } catch (error) {
            console.error(`Failed to send leaderboard: ${error.message}`);
        }
    }, { timezone: "Asia/Jakarta" });

    cron.schedule('0 19 * * 6', async () => {
        try {
            const embed = new EmbedBuilder()
                .setColor(0x5bc6ff)
                .setTitle('🌟 Malam Minggu Telah Tiba! 🌟')
                .setDescription(
                    '**Udah Punya Pacar? 💖**\n' +
                    'Manfaatkan momen ini untuk membuatnya tersenyum! Ajak si doi jalan, nonton bareng, atau makan malam romantis.\n\n' +
                    '**Masih Jomblo? 🤡**\n' +
                    'Tenang! Malam ini adalah waktu yang tepat untuk me-time atau hangout bareng teman di Discord!'
                )
                .setFooter({ text: 'Selamat Malam Minggu 🎉' })
                .setTimestamp();

            await allowedChannel.send({ content: '<@&1222532824075337838>', embeds: [embed] });
            console.log('Pesan Malam Minggu terkirim!');
        } catch (error) {
            console.error(`Gagal mengirim pesan Malam Minggu: ${error.message}`);
        }
    });

    cron.schedule('20 11 * * 5', async () => {
        try {
            const embed = new EmbedBuilder()
                .setColor(0x06FC04)
                .setTitle('Persiapan Sholat Jumat 🕌')
                .setDescription(
                    '📢 **Sudah saatnya mempersiapkan diri untuk Sholat Jumat!**\n' +
                    'Lakukan mandi sunnah, pakai pakaian terbaik, dan bergegas menuju masjid.\n\n' +
                    '🕋 Sholat Jumat adalah momen penuh keberkahan. Jangan sampai tertinggal!'
                )
                .setFooter({ text: 'Ingat, Sholat Jumat wajib bagi kaum laki-laki!' })
                .setTimestamp();

            await allowedChannel.send({ embeds: [embed] });
            console.log('Pesan persiapan Sholat Jumat terkirim!');
        } catch (error) {
            console.error(`Gagal mengirim pesan persiapan Sholat Jumat: ${error.message}`);
        }
    });

    console.log('Scheduled weekly notifications and daily leaderboard.');
});

// Monitor channel events
// client.on('channelCreate', (channel) => {
//     if (channel.guild) logChannelChange(client, channel.guild.id, 'Created', channel.id, channel.name);
// });

// client.on('channelDelete', (channel) => {
//     if (channel.guild) logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channel.name);
// });

// client.on('channelUpdate', (oldChannel, newChannel) => {
//     if (newChannel.guild) {
//         if (oldChannel.name !== newChannel.name) {
//             logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldChannel.name, newChannel.name);
//         }
//         if (!oldChannel.permissionOverwrites.equals(newChannel.permissionOverwrites)) {
//             logChannelChange(client, newChannel.guild.id, 'Updated', newChannel.id, 'Permissions Updated');
//         }
//     }
// });

client.login(token);
