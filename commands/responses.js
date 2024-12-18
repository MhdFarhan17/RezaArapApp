const { join } = require('path');
const { server1, server2 } = require('../utils/constants');

const responseCount = {};
const RESPONSE_LIMIT = 1;
const RESET_TIME = 7000;

function sendResponse(message, content, serverConfig) {
    const images = {
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

    const responses = {
        'pagi': `Selamat pagi! 🌞 Jangan lupa sarapan biar makin semangat! ${message.author}!`,
        'siang': `Siang juga! 🌤️ Jangan lupa makan siang dan isi tenaga ya, ${message.author}! Tetap semangat menghadapi sisa hari ini!`,
        'sore': `Selamat sore! 🌇 Semoga soremu seindah langit senja. ${message.author}!`,
        'malam': `Malam juga, ${message.author}! 🌙 Good night and recharge your energy!`,
        'mek': `Ape lu mak mek mak mek ${message.author}!`,
        'cape': `Kalau cape itu istirahat, jangan malah main game terus ngtod ${message.author}!`,
        'gws': `Semoga lekas membaik ya 😇`,
        'main': `Ayo main sih guys, jangan diem-diem bae! @everyone`,
    };

    if (images[content]) {
        message.channel.send({
            files: [join(__dirname, '..', 'images', images[content])]
        }).then(() => console.log(`Gambar ${content} berhasil dikirim!`))
          .catch(console.error);
    } else if (responses[content]) {
        message.channel.send(responses[content]).catch(console.error);
    } else if (['egrol', 'eboy', 'titit'].includes(content)) {
        const memberId = serverConfig.memberTriggers[content];
        if (memberId) {
            const member = message.guild.members.cache.get(memberId);
            if (member) {
                message.channel.send(`Seseorang memanggil kamu ${member}, coba kamu sapa dulu.`).catch(console.error);
            } else {
                message.channel.send('Seseorang yang kamu coba panggil lagi gak ada').catch(console.error);
            }
        }
    } else {
        handleGameKeywords(content, message, serverConfig);
    }
}

function handleGameKeywords(content, message, serverConfig) {
    const gameKeywords = {
        'gta v': 'gtaRoleId',
        'kota': 'gtaRoleId',
        'gta rp': 'gtaRoleId',
        'valorant': 'valoRoleId',
        'valo': 'valoRoleId',
        'mobile legends': 'mlRoleId',
        'mole': 'mlRoleId',
        'ml': 'mlRoleId',
        'pubg': 'pubgRoleId',
        'babaji': 'pubgRoleId',
        'pubg pc': 'pubgRoleId',
        'overwatch': 'overwatch2RoleId',
        'overwatch 2': 'overwatch2RoleId',
        'roblox': "robloxRoleId",
        'apex': "apexRoleId",
        'apex legend': "apexRoleId",
        'cs': "csRoleId",
        'counter strike': "csRoleId",
        'fortnite': "fortniteRoleId",
        'minecraft': "minecraftRoleId",
        'pubgm': "pubgmobileRoleId",
        'babajim': "pubgmobileRoleId",
        'babaji mobile': "pubgmobileRoleId",
    };

    for (const [key, roleKey] of Object.entries(gameKeywords)) {
        if (content.includes(key)) {
            const roleId = serverConfig[roleKey];
            if (!roleId) {
                console.log(`Pengaturan role ID untuk "${key}" tidak ditemukan di server ${message.guild.id}`);
                return;
            }

            const role = message.guild.roles.cache.get(roleId);
            if (!role) {
                console.log(`Role dengan ID ${roleId} tidak ditemukan di server ${message.guild.id}`);
                return;
            }

            message.channel.send(`Login ${key} gak sih <@&${roleId}>`).catch(console.error);
            break;
        }
    }
}

function handleResponses(message) {
    const guildId = message.guild.id;
    const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

    if (!serverConfig) {
        console.log(`Bot tidak dikonfigurasi untuk server dengan ID ${guildId}`);
        return;
    }

    const content = message.content.toLowerCase();

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