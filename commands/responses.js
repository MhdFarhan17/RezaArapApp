const { join } = require('path');
const { server1, server2 } = require('../utils/constants');

const RESPONSE_LIMIT = 1;
const RESET_TIME = 10000;
const responseCount = {};

// Respons bawaan
const defaultImages = {
    'gg': 'gg.png',
    'good game': 'gg.png',
    'mabar': 'mabar.png',
    'main bareng': 'mabar.png',
    'ez': 'ezz.png',
    'mudah sekali': 'ezz.png',
    'nt': 'nt.png',
    'nice try': 'nt.png',
    'p': 'p.png',
    'hai': 'hello.png',
    'halo': 'hello.png',
    'hello': 'hello.png',
    'tidur': 'tidur.png',
    'mau bobo': 'tidur.png',
    'info': 'info.png',
    'berak': 'berak.jpg',
    'galau': 'galau.jpg',
    'ngakak': 'ngakak.jpg',
    'ah': 'ngntd.jpg',
    'sepi': 'sepi.jpg',
    'senja': 'senja.jpg',
    'kopi senja': 'senja.jpg',
    'cupu': 'cupu.jpg',
    'baru main': 'cupu.jpg',
    'ga jago': 'cupu.jpg',
};

const defaultResponses = {
    'pagi': `Selamat pagi! 🌞 Jangan lupa sarapan biar makin semangat!`,
    'siang': `Siang juga! 🌤️ Jangan lupa makan siang dan isi tenaga ya! Tetap semangat menghadapi sisa hari ini!`,
    'sore': `Selamat sore! 🌇 Semoga soremu seindah langit senja.`,
    'malam': `Malam juga! 🌙 Good night and recharge your energy!`,
    'mek': `Ape lu mak mek mak mek!`,
    'cape': `Kalau cape itu istirahat, jangan malah main game terus ngtod!`,
    'gws': `Semoga lekas membaik ya 😇`,
    'main': `Ayo main sih guys, jangan diem-diem bae! @everyone`,
};

function sendResponse(message, content, serverConfig) {
    // Cek default triggers
    if (defaultImages[content]) {
        message.channel.send({
            files: [join(__dirname, '..', 'images', defaultImages[content])]
        }).catch(console.error);
    } else if (defaultResponses[content]) {
        message.channel.send(defaultResponses[content]).catch(console.error);
    } else {
        handleGameKeywords(content, message, serverConfig);
    }
}

function handleGameKeywords(content, message, serverConfig) {
    const gameKeywords = {
        'valorant': 'valoRoleId',
        'valo': 'valoRoleId',
        'gta v': 'gtavRoleId',
        'ml': 'mlRoleId',
        'pubg': 'pubgRoleId',
        'roblox': 'robloxRoleId',
        'apex': 'apexRoleId',
        'cs': 'csRoleId',
        'fortnite': 'fortniteRoleId',
    };

    if (gameKeywords[content]) {
        const roleId = serverConfig[gameKeywords[content]];
        if (!roleId) {
            console.log(`Role ID untuk '${content}' tidak ditemukan di server ${message.guild.id}`);
            return;
        }

        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            console.log(`Role dengan ID ${roleId} tidak ditemukan di server ${message.guild.id}`);
            return;
        }

        message.channel.send(`Login ${content} gak sih <@&${roleId}>`).catch(console.error);
    }
}

function handleResponses(message) {
    if (message.author.bot || message.content.includes('\n') || message.type !== 'DEFAULT') return;

    const guildId = message.guild.id;
    const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

    if (!serverConfig) {
        console.log(`Server dengan ID ${guildId} tidak dikonfigurasi.`);
        return;
    }

    const content = message.content.toLowerCase().trim();

    if (!responseCount[content]) {
        responseCount[content] = { count: 0, timer: null };
    }

    if (responseCount[content].count < RESPONSE_LIMIT) {
        responseCount[content].count++;
        if (!responseCount[content].timer) {
            responseCount[content].timer = setTimeout(() => {
                responseCount[content].count = 0;
                responseCount[content].timer = null;
            }, RESET_TIME);
        }

        sendResponse(message, content, serverConfig);
    }
}

module.exports = {
    handleResponses
};
