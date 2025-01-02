const { join } = require('path');
const { server1, server2 } = require('../utils/constants');

const responseCount = {};
const RESPONSE_LIMIT = 1;
const RESET_TIME = 10000;

module.exports = {
    handleResponses(message) {
        const serverId = message.guild.id;
        const content = message.content.toLowerCase();
        const config = serverId === server1.guildId ? server1 :
                       serverId === server2.guildId ? server2 :
                       null;
        if (!config) return;

        const userKey = `${content}-${message.author.id}`;
        if (!responseCount[userKey]) {
            responseCount[userKey] = { count: 0, timer: null };
        }
        if (responseCount[userKey].count < RESPONSE_LIMIT) {
            responseCount[userKey].count++;
            if (!responseCount[userKey].timer) {
                responseCount[userKey].timer = setTimeout(() => {
                    responseCount[userKey].count = 0;
                    responseCount[userKey].timer = null;
                }, RESET_TIME);
            }

            // Definisikan logika untuk respon gambar atau teks
            switch (content) {
                case 'good game':
                case 'gg':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'gg.png')]
                    }).then(() => console.log('Gambar GG berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'main bareng':
                case 'mabar':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'mabar.png')]
                    }).then(() => console.log('Gambar Mabar berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'ez':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'ezz.png')]
                    }).then(() => console.log('Gambar EZ berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'nice try':
                case 'nt':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'nt.png')]
                    }).then(() => console.log('Gambar NT berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'p':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'p.png')]
                    }).then(() => console.log('Gambar P berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'halo':
                case 'hello':
                case 'hai':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'hello.png')]
                    }).then(() => console.log('Gambar Hai berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'mau tidur':
                case 'tidur':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'tidur.png')]
                    }).then(() => console.log('Gambar Tidur berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'info':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'info.png')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;
                
                case 'berak':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'berak.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'galau':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'galau.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;

                 case 'ngakak':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'ngakak.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;    

                case 'ah':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'ngntd.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;   

                case 'gak jago':
                case 'baru main':
                case 'cupu':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'cupu.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'senja':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'senja.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'sepi':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'sepi.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;

                // Contoh respon teks
                case 'pagi':
                    message.channel.send(`Selamat pagi! 🌞 Jangan lupa sarapan biar makin semangat! ${message.author}!`).catch(console.error);
                    break;
                case 'siang':
                    message.channel.send(`Siang juga! 🌤️ Jangan lupa makan siang dan isi tenaga ya! Tetap semangat menghadapi sisa hari ini! ${message.author}!`).catch(console.error);
                    break;
                case 'sore':
                    message.channel.send(`Selamat sore! 🌇 Semoga soremu seindah langit senja. ${message.author}!`).catch(console.error);
                    break;
                case 'malam':
                    message.channel.send(`Malam juga! 🌙 Good night and recharge your energy! ${message.author}!`).catch(console.error);
                    break;

                case 'cape':
                    message.channel.send(`Kalau cape itu istirahat, jangan malah main game terus ngtod! ${message.author}!`).catch(console.error);
                    break;

                case 'mek':
                    message.channel.send(`Ape lu mak mek mak mek anjink ${message.author}!`).catch(console.error);
                    break;

                case 'good job':
                    message.channel.send(`Terima kasih, ${message.author}! Kamu juga hebat!`).catch(console.error);
                    break;

                case 'gws':
                    message.channel.send(`Semoga lekas membaik ya 😇`).catch(console.error);
                    break;

                case 'main':
                    message.channel.send(`Ayo main sih ges, jan diem-diem bae! @everyone`).catch(console.error);
                    break;
                
                default:
                    break;
            }

            const triggers = [
                { keywords: ['valorant', 'valo', 'palo'], roleId: config.valoRoleId },
                { keywords: ['mobile legends', 'mole', 'ml'], roleId: config.mlRoleId },
                { keywords: ['roblox'], roleId: config.robloxRoleId },
                { keywords: ['gta v', 'kota', 'gta rp'], roleId: config.gtavRoleId },
                { keywords: ['pubg pc', 'papji', 'babaji'], roleId: config.pubgRoleId },
                { keywords: ['counter strike', 'cs 2', 'cs'], roleId: config.csRoleId },
                { keywords: ['overwatch 2', 'overwatch'], roleId: config.overwatch2RoleId },
                { keywords: ['apex legends', 'apex'], roleId: config.apexRoleId },
                { keywords: ['fortnite'], roleId: config.fortniteRoleId },
                { keywords: ['minecraft'], roleId: config.minecraftRoleId },
            ];

            // Cek pesan apakah cocok dengan keyword secara penuh
            for (const trigger of triggers) {
                if (trigger.keywords.includes(content)) {
                    const roleId = trigger.roleId;
                    message.channel.send(`Login ${trigger.keywords[0].toUpperCase()} gak sih <@&${roleId}>`);
                    return;
                }
            }
        }
    }
};
