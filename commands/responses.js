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
                        files: [join(__dirname, '..', 'images', 'gg.png')]
                    }).then(() => console.log('Gambar GG berhasil dikirim!'))
                      .catch(console.error);
                    break;

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

                case 'hai':
                case 'halo':
                case 'hello':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'hello.png')]
                    }).then(() => console.log('Gambar Hai berhasil dikirim!'))
                      .catch(console.error);
                    break;

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
                case 'sepi':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'sepi.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;
                case 'senja':
                case 'kopi senja':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'senja.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;
                case 'cupu':
                case 'baru main':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'cupu.jpg')]
                    }).then(() => console.log('Gambar Info berhasil dikirim!'))
                      .catch(console.error);
                    break;





                // Contoh respon teks
                case 'pagi':
                case 'selamat pagi':
                case 'good morning':
                    message.channel.send(`Selamat pagi! 🌞 Jangan lupa sarapan biar makin semangat! Semoga harimu penuh keberkahan, ${message.author}! 🤗`).catch(console.error);
                    break;
                case 'siang':
                case 'selamat siang':
                    message.channel.send(`Siang juga! 🌤️ Jangan lupa makan siang dan isi tenaga ya, ${message.author}! Tetap semangat menghadapi sisa hari ini! 💪`).catch(console.error);
                    break;
                case 'sore':
                case 'selamat sore':
                    message.channel.send(`Selamat sore! 🌇 Semoga soremu seindah langit senja. Waktunya santai sejenak sebelum lanjut aktivitas, ${message.author}! 🍵`).catch(console.error);
                    break;
                case 'malam':
                case 'selamat malam':
                case 'good night':
                    message.channel.send(`Malam juga, ${message.author}! 🌙 Semoga tidurmu nyenyak dan mimpi indah ya. Good night and recharge your energy! 🛌💤`).catch(console.error);
                    break;
                case 'mek':
                    message.channel.send(`Ape lu mak mek mak mek ${message.author}!`).catch(console.error);
                    break;
                case 'cape':
                    message.channel.send(`Kalau cape itu istirahat, jangan malah main game terus.`).catch(console.error);
                    break;
                case 'gws':
                    message.channel.send(`Get Well Soon ya Tod!`).catch(console.error);
                    break;
                case 'main':
                    message.channel.send(`Ayo main sih guys, jangan diem-diem bae! @everyone`).catch(console.error);
                    break;
                case 'valo':
                case 'mabar valo':
                case 'valorant':
                    const valoRoleId = '1236564378585661441';
                    message.channel.send(`Login valo gak sih <@&${valoRoleId}>`).catch(console.error);
                    break;
                case 'roblox':
                    const robloxRoleId = '1236563915497013318';
                    message.channel.send(`Ayo main Roblox <@&${robloxRoleId}>`).catch(console.error);
                    break;
                case 'ml':
                case 'mabar ml':
                case 'mole':
                    const MLRoleId = '1254019853501599817';
                    message.channel.send(`Ayo mabar Mobile Legends <@&${MLRoleId}>`).catch(console.error);
                    break;   
                case 'pubg':
                case 'babaji':
                case 'pubg pc':
                    const pubgRoleId = '1236954189016334398';
                    message.channel.send(`Ayo Mabar PUBG PC <@&${pubgRoleId}>`).catch(console.error);
                    break;            
                case 'egrol':
                case 'egirl':
                    const targetMemberId = '707278921757884439';
                    const targetMember = message.guild.members.cache.get(targetMemberId);
                    if (targetMember) {
                        message.channel.send(`Seseorang memanggil kamu ${targetMember}, karena kamu adalah seorang "Boosted Egg Roll"`).catch(console.error);
                    } else {
                        message.channel.send('lagi gak bisa tag kesh').catch(console.error);
                    }
                    break;

                case 'eboy':
                    const targetMemberId2 = '439407175555612680';
                    const targetMember2 = message.guild.members.cache.get(targetMemberId2);
                    if (targetMember2) {
                        message.channel.send(`Seseorang memanggil kamu ${targetMember2}, karena kamu adalah seorang "Eboy" yang sudah terverified GitGud.`).catch(console.error);
                    } else {
                        message.channel.send('gak bisa tag vlum').catch(console.error);
                    }
                    break;
                
                case 'titit':
                    const targetMemberId3 = '835177633569964092';
                    const targetMember3 = message.guild.members.cache.get(targetMemberId3);
                    if (targetMember3) {
                        message.channel.send(`Seseorang memanggil kamu ${targetMember3}`).catch(console.error);
                    } else {
                        message.channel.send('lagi gak bisa tag surya').catch(console.error);
                    }
                    break;
                default:
                    break;
            }
        }
    }
};
