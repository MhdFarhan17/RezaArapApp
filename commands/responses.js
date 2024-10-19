const { join } = require('path');

const responseCount = {};
const RESPONSE_LIMIT = 1;
const RESET_TIME = 7000;

module.exports = {
    handleResponses(message) {
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

            switch (content) {
                case 'gg':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'gg_images.png')]
                    }).then(() => console.log('Gambar GG berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'mabar':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'mabar_images.png')]
                    }).then(() => console.log('Gambar Mabar berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'ez':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'ez_images.png')]
                    }).then(() => console.log('Gambar EZ berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'nt':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'nt_images.png')]
                    }).then(() => console.log('Gambar NT berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'p':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'p_images.png')]
                    }).then(() => console.log('Gambar P berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'hai':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'hai_images.png')]
                    }).then(() => console.log('Gambar Hai berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'tidur':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'tidur_images.png')]
                    }).then(() => console.log('Gambar Tidur berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'info':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'info_images.png')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;

                // Contoh respon teks
                case 'mek':
                    message.channel.send(`Ape lu mak mek mak mek anjink ${message.author}!`).catch(console.error);
                    break;
                    
                case 'cape':
                    message.channel.send(`Kalau cape itu istirahat, jangan malah main game terus.`).catch(console.error);
                    break;
                case 'good job':
                    message.channel.send(`Terima kasih, ${message.author}! Kamu juga hebat!`).catch(console.error);
                    break;

                case 'gws':
                    message.channel.send(`Get Well Soon ya Tod!`).catch(console.error);
                    break;

                case 'main':
                    message.channel.send(`Ayo main sih ges, jan diem-diem bae! @everyone`).catch(console.error);
                    break;

                case 'valo':
                    const valoRoleId = '1236564378585661441';
                    message.channel.send(`Ayo main valo ges <@&${valoRoleId}>`).catch(console.error);
                    break;

                case 'roblox':
                    const robloxRoleId = '1236563915497013318';
                    message.channel.send(`Ayo main Roblox gess <@&${robloxRoleId}>`).catch(console.error);
                    break;
                
                case 'egrol':
                case 'egirl':
                    const targetMemberId = '707278921757884439';
                    const targetMember = message.guild.members.cache.get(targetMemberId);
                    if (targetMember) {
                        message.channel.send(`Seseorang memanggil kamu ${targetMember}, karena kamu adalah seorang "Boosted Egg Roll"`).catch(console.error);
                    } else {
                        message.channel.send('Parah banget sih onty kesh, gabisa tag kamu loh 😭😭😭').catch(console.error);
                    }
                    break;

                case 'eboy':
                    const targetMemberId2 = '439407175555612680';
                    const targetMember2 = message.guild.members.cache.get(targetMemberId2);
                    if (targetMember2) {
                        message.channel.send(`Seseorang memanggil kamu ${targetMember2}, karena kamu adalah seorang "Eboy" yang sudah terverified GitGud.`).catch(console.error);
                    } else {
                        message.channel.send('Sedih aku teh gabisa tag kamu eboy Vlum😭😭😭.').catch(console.error);
                    }
                    break;
                
                case 'titit':
                    const targetMemberId3 = '835177633569964092';
                    const targetMember3 = message.guild.members.cache.get(targetMemberId3);
                    if (targetMember3) {
                        message.channel.send(`Seseorang memanggil kamu ${targetMember3}, karena muka kamu mirip titit kuda.`).catch(console.error);
                    } else {
                        message.channel.send('Suryaaaaaaaaa, aku gabisa tag kamu 😭😭😭').catch(console.error);
                    }
                    break;
                default:
                    break;
            }
        }
    }
};
