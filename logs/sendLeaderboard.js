const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { loadVoiceTimes, saveVoiceTime } = require('../utils/voiceTimes');
const { server1 } = require('../utils/constants');

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} jam, ${minutes} menit, ${seconds} detik`;
}

// Fungsi untuk memperbarui waktu aktif bagi pengguna yang masih berada di voice channel
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

async function updateLeaderboardEmbed(interaction, client, channel, sortedTimes, page = 1, perPage = 10, disableButtons = false) {
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
        .setFooter({ text: 'Leaderboard direset setiap bulan.' })
        .setTimestamp();

    let components = [];
    if (sortedTimes.length > perPage) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`previous_page_${page}`)
                    .setLabel('⬅️ Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(disableButtons || page === 1),
                new ButtonBuilder()
                    .setCustomId(`page_info_${page}`)
                    .setLabel(`Page ${page} of ${totalPages}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`next_page_${page}`)
                    .setLabel('Next ➡️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(disableButtons || page === totalPages)
            );
        components = [row];
    }

    if (interaction) {
        await interaction.update({ embeds: [embed], components });
    } else {
        await channel.send({ embeds: [embed], components });
    }
}

async function sendLeaderboard(client) {
    let voiceTimes = await loadVoiceTimes();
    await updateActiveSessionTimes(client, voiceTimes);

    const sortedTimes = Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime);
    const channel = client.channels.cache.get(server1.leaderboardChannelId);

    if (channel) {
        const message = await channel.send({ content: 'Leaderboard...' });
        const filter = (interaction) => interaction.isButton();
        const collector = message.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async (interaction) => {
            await interaction.deferUpdate();
        
            const page = parseInt(interaction.customId.split('_')[2]);
            const nextPage = interaction.customId.includes('next') ? page + 1 : page - 1;
        
            if (nextPage >= 1 && nextPage <= Math.ceil(sortedTimes.length / 10)) {
                await updateLeaderboardEmbed(interaction, client, channel, sortedTimes, nextPage);
            }
        });

        // Setelah kolektor berakhir, nonaktifkan tombol alih-alih menghapusnya
        collector.on('end', async () => {
            try {
                await updateLeaderboardEmbed(null, client, channel, sortedTimes, 1, true); // Disable all buttons
                console.log('Buttons disabled after timeout.');
            } catch (error) {
                console.error('Error when trying to disable buttons:', error);
            }
        });

        await updateLeaderboardEmbed(null, client, channel, sortedTimes, 1);
    } else {
        console.log('Leaderboard channel not found.');
    }
}

module.exports = { sendLeaderboard };