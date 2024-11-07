const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { convertToFancyFonts } = require('./fontUtils');

module.exports = {
    name: 'fontGenerator',
    async execute(message) {
        const input = message.content.split(' ').slice(1).join(' ');
        if (!input) {
            return message.channel.send('Silakan masukkan teks untuk dikonversi!');
        }

        const fancyFonts = convertToFancyFonts(input);
        const totalPages = Math.ceil(fancyFonts.length / 10);
        let currentPage = 0;

        const generateEmbed = (page) => {
            const embed = new EmbedBuilder()
                .setTitle(`Berikut adalah beberapa pilihan gaya font untuk "${input}":`)
                .setDescription(
                    fancyFonts
                        .slice(page * 10, (page + 1) * 10)
                        .map((font, index) => `${page * 10 + index + 1}. ${font}`)
                        .join('\n')
                )
                .setFooter({ text: `Halaman ${page + 1} dari ${totalPages}` });
            return embed;
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('⏪ Previous')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('⏩ Next')
                    .setStyle(ButtonStyle.Primary)
            );

        const messageEmbed = await message.channel.send({
            embeds: [generateEmbed(currentPage)],
            components: [row]
        });

        const collector = messageEmbed.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', interaction => {
            if (interaction.customId === 'next') {
                currentPage = currentPage + 1 < totalPages ? currentPage + 1 : 0;
            } else if (interaction.customId === 'previous') {
                currentPage = currentPage - 1 >= 0 ? currentPage - 1 : totalPages - 1;
            }

            interaction.update({
                embeds: [generateEmbed(currentPage)],
                components: [row]
            });
        });

        collector.on('end', () => {
            messageEmbed.edit({ components: [] });
        });
    }
};
