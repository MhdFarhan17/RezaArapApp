const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { sendLeaderboard } = require('./logs/sendLeaderboard');
const cron = require('node-cron');
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

// Load event files dari folder events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    try {
        if (event.name && event.execute) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        } else {
            console.error(`Event ${file} is missing a valid name or execute function.`);
        }
    } catch (error) {
        console.error(`Error loading event ${file}: ${error.message}`);
    }
}

// Ketika bot siap (ready)
client.once('ready', () => {
    console.log('Bot siap dan berjalan!');

    // Ambil guild dan command channel
    const guild = client.guilds.cache.get(server1.guildId);
    if (!guild) {
        console.error(`Guild dengan ID ${server1.guildId} tidak ditemukan!`);
        return;
    }

    const commandChannel = guild.channels.cache.get(server1.commandChannelId);
    if (!commandChannel) {
        console.error(`Command channel dengan ID ${server1.commandChannelId} tidak ditemukan!`);
        return;
    }

    // Schedule pesan Malam Minggu pukul 19:00 WIB (setiap hari Minggu)
    cron.schedule('0 19 * * 0', async () => {
        try {
            const message = "Selamat Malam Minggu! 🌙✨\n" +
                "Untuk yang sudah punya pasangan, nikmati waktunya bersama pasanganmu! 💖\n" +
                "Untuk yang belum punya pasangan, tetap semangat! Malam Minggu bukan berarti harus bersedih. Kamu keren walau jomblo! 💪✨";
            await commandChannel.send(message);
            console.log('Pesan Malam Minggu terkirim!');
        } catch (error) {
            console.error(`Gagal mengirim pesan Malam Minggu: ${error.message}`);
        }
    });

    // Schedule pesan persiapan Sholat Jumat pukul 11:20 WIB (setiap hari Jumat)
    cron.schedule('20 11 * * 5', async () => {
        try {
            const message = "Hai bro! Sudah waktunya persiapan Sholat Jumat. Jangan lupa mandi, pakai pakaian rapi dan wangi, dan segera berangkat ke masjid! 🙏✨";
            await commandChannel.send(message);
            console.log('Pesan persiapan Sholat Jumat terkirim!');
        } catch (error) {
            console.error(`Gagal mengirim pesan persiapan Sholat Jumat: ${error.message}`);
        }
    });

    console.log('Penjadwalan pesan otomatis telah disiapkan.');
});

// Schedule untuk pengiriman leaderboard setiap hari pukul 00:00 WIB
cron.schedule('0 0 * * *', () => {
    try {
        console.log('Leaderboard Terkirim pada pukul 00:00 WIB...');
        sendLeaderboard(client);
    } catch (error) {
        console.error(`Gagal mengirim leaderboard: ${error.message}`);
    }
});

// Login bot ke Discord
client.login(token);