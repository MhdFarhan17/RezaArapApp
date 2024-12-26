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

            // Definisikan logika untuk respon gambar atau teks
            switch (content) {
                case 'good gaem':
                case 'gg':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'gg_images.png')]
                    }).then(() => console.log('Gambar GG berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'main bareng':
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

                case 'nicetry':
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

                case 'halo':
                case 'hello':
                case 'hai':
                    message.channel.send({
                        files: [join(__dirname, '..', 'images', 'hai_images.png')]
                    }).then(() => console.log('Gambar Hai berhasil dikirim!'))
                      .catch(console.error);
                    break;

                case 'mau tidur':
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
                case 'mek':
                    message.channel.send(`Ape lu mak mek mak mek anjink ${message.author}!`).catch(console.error);
                    break;
                    
                case 'eboy':
                    message.channel.send(`Weyy Vlum, sedih banget aku udah gabisa mention kamu lagi😭. Dasar Eboyy!!`).catch(console.error);
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
                    const valoRoleId = '1236564378585661441'; // Ganti dengan ID role yang diinginkan
                    message.channel.send(`Ayo main valo ges <@&${valoRoleId}>`).catch(console.error);
                    break;

                case 'roblox':
                    const robloxRoleId = '1236563915497013318'; // Ganti dengan ID role yang diinginkan
                    message.channel.send(`Ayo main Roblox gess <@&${robloxRoleId}>`).catch(console.error);
                    break;
                
                // case 'egrol':
                // case 'egirl':
                //     const targetMemberId = '707278921757884439'; // Ganti dengan ID member yang ingin Anda mention
                //     const targetMember = message.guild.members.cache.get(targetMemberId);
                //     if (targetMember) {
                //         message.channel.send(`Seseorang memanggil kamu ${targetMember}, karena kamu adalah seorang "Boosted Egg Roll"`).catch(console.error);
                //     } else {
                //         message.channel.send('Member tidak ditemukan untuk sebutan "Boosted Egg Roll". Pastikan ID member sudah benar.').catch(console.error);
                //     }
                //     break;

                // case 'eboni':
                //     const targetMemberId2 = '439407175555612680'; // Ganti dengan ID member yang ingin Anda mention
                //     const targetMember2 = message.guild.members.cache.get(targetMemberId2);
                //     if (targetMember2) {
                //         message.channel.send(`Seseorang memanggil kamu ${targetMember2}, karena kamu adalah seorang "Eboni sekaligus eboy valo"`).catch(console.error);
                //     } else {
                //         message.channel.send('Member tidak ditemukan untuk sebutan "eboni". Pastikan ID member sudah benar.').catch(console.error);
                //     }
                //     break;
                
                // case 'titit':
                //     const targetMemberId3 = '835177633569964092'; // Ganti dengan ID member yang ingin Anda mention
                //     const targetMember3 = message.guild.members.cache.get(targetMemberId3);
                //     if (targetMember3) {
                //         message.channel.send(`Seseorang memanggil kamu ${targetMember3}, karena muka kamu mirip tititnya mulyono. /n #bang fancy yang bilang`).catch(console.error);
                //     } else {
                //         message.channel.send('Member tidak ditemukan untuk sebutan "titit". Pastikan ID member sudah benar.').catch(console.error);
                //     }
                //     break;
                // Jika tidak ada kata yang cocok, tidak ada tindakan
                default:
                    break;
            }
        }
    }
};
