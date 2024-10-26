const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { server1 } = require('../utils/constants');

function loadVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    const backupData = process.env.VOICETIMES_BACKUP || "{}";
    try {
        return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : JSON.parse(backupData);
    } catch (error) {
        console.error('Error loading voiceTimes:', error);
        return {};
    }
}

function saveVoiceTimes(voiceTimes) {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    try {
        const sortedVoiceTimes = Object.fromEntries(
            Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime)
        );
        fs.writeFileSync(filePath, JSON.stringify(sortedVoiceTimes, null, 4));
        process.env.VOICETIMES_BACKUP = JSON.stringify(sortedVoiceTimes);
        console.log('voiceTimes.json updated and saved with environment backup.');
    } catch (error) {
        console.error('Error saving voiceTimes.json:', error);
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} jam, ${minutes} menit, ${seconds} detik`;
}

async function updateLeaderboardEmbed(interaction, client, channel, sortedTimes, page = 1, perPage = 10) {
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
            console.error(`Failed to fetch user ${userId}:`, error);
            leaderboardDescription += `**${i + 1}. [User not found]** ${formatTime(totalTime)}\n`;
        }
    }

    const embed = new EmbedBuilder()
        .setTitle('𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝 𝐓𝐞𝐫𝐥𝐚𝐦𝐚 𝐝𝐢 𝐕𝐨𝐢𝐜𝐞-𝐂𝐡𝐚𝐧𝐧𝐞𝐥 𝐆𝐈𝐓𝐆𝐔𝐃')
        .setDescription(leaderboardDescription || 'Tidak ada data yang tersedia.')
        .setColor(0x1abc9c)
        .setFooter({ text: 'Leaderboard direset setiap bulan.' })
        .setTimestamp();

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`previous_page_${page}`)
                .setLabel('⬅️ Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1),
            new ButtonBuilder()
                .setCustomId(`page_info_${page}`)
                .setLabel(`Page ${page} of ${totalPages}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`next_page_${page}`)
                .setLabel('Next ➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages)
        );

    if (interaction) {
        await interaction.update({ embeds: [embed], components: [row] });
    } else {
        await channel.send({ embeds: [embed], components: [row] });
    }
}

async function sendLeaderboard(client) {
    const voiceTimes = loadVoiceTimes();
    const now = Date.now();

    for (const [userId, data] of Object.entries(voiceTimes)) {
        if (data.joinTime) {
            const currentSessionTime = now - data.joinTime;
            voiceTimes[userId].totalTime += currentSessionTime;
            voiceTimes[userId].joinTime = now;
        }
    }

    saveVoiceTimes(voiceTimes);

    const sortedTimes = Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime);
    const channel = client.channels.cache.get(server1.leaderboardChannelId);

    if (channel) {
        try {
            const message = await channel.send({ content: 'Loading leaderboard...' });
            const filter = (interaction) => interaction.isButton();
            const collector = message.createMessageComponentCollector({ filter, time: 300000 });

            collector.on('collect', async (interaction) => {
                const page = parseInt(interaction.customId.split('_').pop());
                const nextPage = interaction.customId.includes('next') ? page + 1 : page - 1;
                await updateLeaderboardEmbed(interaction, client, channel, sortedTimes, nextPage);
            });

            collector.on('end', async () => {
                try {
                    // Menghapus semua tombol ketika kolektor habis waktu
                    await message.edit({ components: [] });
                } catch (error) {
                    console.error('Failed to remove buttons:', error);
                }
            });

            await updateLeaderboardEmbed(null, client, channel, sortedTimes, 1);
        } catch (error) {
            console.error('Error sending leaderboard:', error);
        }
    } else {
        console.log('Leaderboard channel not found.');
    }
}

module.exports = { sendLeaderboard };