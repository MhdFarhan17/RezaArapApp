const { convertToFancyFonts } = require('../utils/fontUtils');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { fontGeneratorId } = require('../utils/constants');

async function handleFontRequest(client, message) {
    // Periksa apakah pesan berasal dari channel yang sesuai
    if (message.channel.id !== fontGeneratorId) return;

    // Ambil argumen teks setelah perintah
    const args = message.content.split(' ').slice(1);
    if (args.length === 0) {
        return message.channel.send('Mohon masukkan teks setelah perintah `font!` untuk mengubah gaya font.');
    }
    const inputText = args.join(' ');

    // Konversi teks ke berbagai gaya font
    const fonts = convertToFancyFonts(inputText);
    
    // Bagi font menjadi halaman per 10 item
    const pages = [];
    const itemsPerPage = 10;
    for (let i = 0; i < fonts.length; i += itemsPerPage) {
        pages.push(fonts.slice(i, i + itemsPerPage));
    }

    // Fungsi untuk membuat embed halaman
    const createEmbed = (page, pageIndex, totalPages) => {
        const embed = new EmbedBuilder()
            .setTitle(`Pilihan Gaya Font untuk "${inputText}"`)
            .setDescription(page.map((font, index) => `${index + 1 + pageIndex * itemsPerPage}. ${font}`).join('\n'))
            .setFooter({ text: `Halaman ${pageIndex + 1} dari ${totalPages}` })
            .setColor('#0099ff');
        return embed;
    };

    let currentPage = 0;
    const totalPages = pages.length;

    // Kirim pesan embed pertama dengan tombol navigasi
    const messageEmbed = await message.channel.send({
        embeds: [createEmbed(pages[currentPage], currentPage, totalPages)],
        components: totalPages > 1 ? [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
            )
        ] : []
    });

    if (totalPages <= 1) return;

    // Buat collector untuk tombol
    const filter = i => i.user.id === message.author.id;
    const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
        if (i.customId === 'previous') {
            currentPage = Math.max(currentPage - 1, 0);
        } else if (i.customId === 'next') {
            currentPage = Math.min(currentPage + 1, totalPages - 1);
        }

        await i.update({
            embeds: [createEmbed(pages[currentPage], currentPage, totalPages)],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === totalPages - 1)
                )
            ]
        });
    });

    collector.on('end', () => {
        messageEmbed.edit({ components: [] }).catch(console.error);
    });
}

module.exports = { handleFontRequest };
