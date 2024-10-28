const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { sendLeaderboard } = require('./logs/sendLeaderboard');
const cron = require('node-cron');
const moment = require('moment-timezone');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const { server1 } = require('./utils/constants');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.name && event.execute) {
        event.once
            ? client.once(event.name, (...args) => event.execute(...args, client))
            : client.on(event.name, (...args) => event.execute(...args, client));
    } else {
        console.warn(`Event ${file} is missing a valid name or execute function.`);
    }
}

client.once('ready', () => {
    console.log('Bot Discord YB sudah ready!');

    const guild = client.guilds.cache.get(server1.guildId);
    if (!guild) {
        console.error(`Guild dengan ID ${server1.guildId} tidak ditemukan!`);
        return;
    }

    // Get allowed channel for announcements
    const allowedChannelId = server1.allowedChannelIds[0];
    const allowedChannel = guild.channels.cache.get(allowedChannelId);
    if (!allowedChannel) {
        console.error(`Allowed channel dengan ID ${allowedChannelId} tidak ditemukan!`);
        return;
    }

    // Get leaderboard channel for sending leaderboard messages
    const leaderboardChannelId = server1.leaderboardChannelId;
    const leaderboardChannel = guild.channels.cache.get(leaderboardChannelId);
    if (!leaderboardChannel) {
        console.error(`Leaderboard channel dengan ID ${leaderboardChannelId} tidak ditemukan!`);
        return;
    }

    // Schedule daily leaderboard in the leaderboard channel
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Sending daily leaderboard...');
            await sendLeaderboard(client);
        } catch (error) {
            console.error(`Failed to send leaderboard: ${error.message}`);
        }
    }, { timezone: "Asia/Jakarta" });

    // Schedule Malam Minggu message in the allowed channel
    cron.schedule('0 19 * * 6', async () => {
        try {
            const embed = new EmbedBuilder()
                .setColor(0xFF69B4)
                .setTitle('Malam Minggu Telah Tiba!')
                .setDescription(
                    '💞 **Yang udah punya pacar**, yuk keluar dan rayakan cinta kalian! Jangan cuma ngechat, ajak dia jalan atau nonton bareng! Selamat Bucin ... 😘💕\n\n' +
                    '🤡 **Yang masih jomblo?** Jangan sedih, Malam Minggu bukan hanya untuk pasangan! Ayo main game, hangout bareng teman-teman Discord kita, atau nikmati keseruan malam sendiri. Kamu keren walau kamu jomblo! 💪😎\n\n'
                )
                .setFooter({ text: 'Selamat Malam Mingguan guys 🎉' })
                .setTimestamp();

            await allowedChannel.send({ content: '<@&1222532824075337838>', embeds: [embed] });
            console.log('Pesan Malam Minggu terkirim!');
        } catch (error) {
            console.error(`Gagal mengirim pesan Malam Minggu: ${error.message}`);
        }
    });

    // Schedule Friday prayer reminder in the allowed channel
    cron.schedule('30 11 * * 5', async () => {
        try {
            const embed = new EmbedBuilder()
                .setColor(0x1E90FF)
                .setTitle('🕌 Persiapan Sholat Jumat')
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
