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

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.name && event.execute) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

client.once('ready', () => {
    console.log('Bot siap dan berjalan!');

    const guild = client.guilds.cache.get(server1.guildId);
    const commandChannel = guild.channels.cache.get(server1.commandChannelId);

    if (!commandChannel) {
        console.error('Command channel tidak ditemukan!');
        return;
    }

    cron.schedule('0 19 * * 0', async () => {
        const message = "Selamat Malam Minggu! 🌙✨\n" +
            "Untuk yang sudah punya pasangan, nikmati waktunya bersama pasanganmu! 💖\n" +
            "Untuk yang belum punya pasangan, tetap semangat! Malam Minggu bukan berarti harus bersedih. Kamu keren walau jomblo! 💪✨";
        await commandChannel.send(message);
    });

    cron.schedule('20 11 * * 5', async () => {
        const message = "Hai bro! Sudah waktunya persiapan Sholat Jumat. Jangan lupa mandi, pakai pakaian rapi dan wangi, dan segera berangkat ke masjid! 🙏✨";
        await commandChannel.send(message);
    });

    console.log('Penjadwalan pesan otomatis telah disiapkan.');
});

cron.schedule('0 0 * * *', () => {
    console.log('Leaderboard Terkirim pada pukul 00:00 WIB...');
    sendLeaderboard(client);
});

client.login(token);