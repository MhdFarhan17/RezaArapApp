const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { sendLeaderboard } = require('./logs/sendLeaderboard');
const { initializeVoiceTimes } = require('./events/voiceStateUpdate');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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
                    .setTitle('𝐀𝐜𝐭𝐢𝐯𝐞 𝐁𝐨𝐨𝐬𝐭𝐞𝐫')
                    .setDescription(`**${member.user.tag}** is actively boosting the server!`)
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    .setImage('attachment://activboost.gif')
                    .setFooter({ text: 'Server Boosted 🚀🚀🚀' })
                    .setTimestamp();

                boostChannel.send({
                    embeds: [embed],
                    files: [{ attachment: path.join(__dirname, 'gifs', 'activboost.gif'), name: 'activboost.gif' }]
                });
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
                .setTitle('🌟Malam Minggu Telah Tiba!🌟')
                .setDescription(
                    '**Udah Punya Pacar? 💖**\n' +
                    'Ayo, manfaatkan momen ini untuk membuatnya tersenyum! Nggak cuma nge-chat doang, ajak si doi jalan, nonton bareng, atau makan malam romantis. Biar makin lengket dan makin bucin! 😘💕\n\n' +
                    '**Masih Jomblo? 🤡**\n' +
                    'Eits, tenang aja! Malam Minggu bukan cuma buat yang punya pasangan kok. Ayo, manfaatkan malam ini buat me-time atau hangout bareng teman-teman Discord GITGUD! Main game, ngobrol seru, atau nikmati literatur sendirian. Kamu keren meski jomblo, bro! 💪😎\n\n'
                )
                .setFooter({ text: 'Selamat Malam Minggu🎉' })
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
                .setTitle('Persiapan Sholat Jumat 🕌 ')
                .setDescription(
                    '📢 **Wahai para ikhwan!** Sudah saatnya mempersiapkan diri untuk menunaikan Sholat Jumat. Jangan lupa mandi sunnah, pakai pakaian terbaikmu, wangi-wangian, dan bergegaslah menuju masjid. 🌿\n\n' +
                    '🕋 Sholat Jumat adalah momen penuh keberkahan, mari raih pahala yang berlipat dengan hadir tepat waktu dan mendengarkan khotbah dengan khusyuk. Semoga hari ini membawa banyak kebaikan bagi kita semua. 🤲✨'
                )
                .setFooter({ text: 'Ingat, Sholat Jumat itu wajib bagi kaum laki-laki. Jangan sampai tertinggal!' })
                .setTimestamp();

            await allowedChannel.send({ embeds: [embed] });
            console.log('Pesan persiapan Sholat Jumat terkirim!');
        } catch (error) {
            console.error(`Gagal mengirim pesan persiapan Sholat Jumat: ${error.message}`);
        }
    });

    console.log('Scheduled weekly notifications and daily leaderboard.');
});

client.login(token);