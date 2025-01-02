const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { loadVoiceTimes } = require('../utils/voiceTimes');
const { server1 } = require('../utils/constants');

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} jam, ${minutes} menit, ${seconds} detik`;
}

async function updateActiveSessionTimes(client, voiceTimes) {
    const now = Date.now();

    for (const userId in voiceTimes) {
        const member = await client.guilds.cache.get(server1.guildId).members.fetch(userId).catch(() => null);
        if (member && member.voice.channel && voiceTimes[userId].joinTime) {
            const activeSessionTime = now - voiceTimes[userId].joinTime;
            voiceTimes[userId].totalTime += activeSessionTime;
            voiceTimes[userId].joinTime = now;
        }
    }
}

async function updateLeaderboardEmbed(client, message, sortedTimes, page = 1, perPage = 10, disableButtons = false) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const totalPages = Math.ceil(sortedTimes.length / perPage);

    let leaderboardDescription = '';
    for (let i = start; i < end && i < sortedTimes.length; i++) {
        const [userId, { totalTime }] = sortedTimes[i];
        try {
            const user = await client.users.fetch(userId);
            leaderboardDescription += `**${i + 1}. ${user.tag}** ${formatTime(totalTime)}\n`;
        } catch (error) {
            console.error(`Gagal mengambil data user ${userId}:`, error);
            leaderboardDescription += `**${i + 1}. [User not found]** ${formatTime(totalTime)}\n`;
        }
    }

    const embed = new EmbedBuilder()
        .setTitle('𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝 𝐓𝐞𝐫𝐥𝐚𝐦𝐚 𝐝𝐢 𝐕𝐨𝐢𝐜𝐞-𝐂𝐡𝐚𝐧𝐧𝐞𝐥 𝐆𝐈𝐓𝐆𝐔𝐃')
        .setDescription(leaderboardDescription || 'Tidak ada data yang tersedia.')
        .setColor(0x1abc9c)
        .setFooter({ text: `Page ${page} of ${totalPages}  |  Reset data setiap bulan` })
        .setTimestamp();

    const components = totalPages > 1 && !disableButtons ? [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`previous_page_${page}`)
                .setLabel('⬅️ Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1),
            new ButtonBuilder()
                .setCustomId(`next_page_${page}`)
                .setLabel('Next ➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages)
        )
    ] : [];

    await message.edit({ embeds: [embed], components });
}

async function sendLeaderboard(client) {
    let voiceTimes = await loadVoiceTimes();
    await updateActiveSessionTimes(client, voiceTimes);

    const sortedTimes = Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime);
    const channel = client.channels.cache.get(server1.leaderboardChannelId);

    if (channel) {
        const message = await channel.send({ content: 'Leaderboard Terkirim...' });
        await updateLeaderboardEmbed(client, message, sortedTimes, 1);

        const filter = (interaction) => interaction.isButton();
        const collector = message.createMessageComponentCollector({ filter, time: 600000 });
        let currentPage = 1;

        collector.on('collect', async (interaction) => {
            await interaction.deferUpdate();

            const page = parseInt(interaction.customId.split('_')[2]);
            const nextPage = interaction.customId.includes('next') ? page + 1 : page - 1;

            if (nextPage >= 1 && nextPage <= Math.ceil(sortedTimes.length / 10)) {
                currentPage = nextPage;
                await updateLeaderboardEmbed(client, message, sortedTimes, currentPage);
            }
        });

        collector.on('end', async () => {
            try {
                await updateLeaderboardEmbed(client, message, sortedTimes, currentPage, 10, true);
                console.log('Buttons disabled after timeout.');
            } catch (error) {
                console.error('Error disabling buttons:', error);
            }
        });
    } else {
        console.log('Leaderboard channel not found.');
    }
}

module.exports = { sendLeaderboard };
