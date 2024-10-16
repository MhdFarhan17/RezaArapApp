const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { server1 } = require('../utils/constants');

// Load voice times from file
function loadVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading voiceTimes.json:', error);
            return {};
        }
    } else {
        return {};
    }
}

// Save the voice times to a JSON file with pretty formatting and sorted order
function saveVoiceTimes(voiceTimes) {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    try {
        const sortedVoiceTimes = Object.fromEntries(
            Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime)
        );
        fs.writeFileSync(filePath, JSON.stringify(sortedVoiceTimes, null, 4));
        console.log(`voiceTimes.json updated and saved.`);
    } catch (error) {
        console.error('Error saving voiceTimes.json:', error);
    }
}

// Format time in hours, minutes, and seconds (in Indonesian)
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} jam, ${minutes} menit, ${seconds} detik`;
}

// Fungsi untuk mengirimkan leaderboard per halaman
async function sendLeaderboardPage(client, channel, sortedTimes, page = 1, perPage = 10) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const totalPages = Math.ceil(sortedTimes.length / perPage);

    let leaderboardDescription = '';
    for (let i = start; i < end && i < sortedTimes.length; i++) {
        const [userId, { totalTime }] = sortedTimes[i];
        const user = await client.users.fetch(userId);
        leaderboardDescription += `**${i + 1}. ${user.tag}** ${formatTime(totalTime)}\n`;
    }

    const embed = new EmbedBuilder()
        .setTitle(`𝐋𝐞𝐚𝐝𝐞𝐫𝐛𝐨𝐚𝐫𝐝 𝐓𝐞𝐫𝐥𝐚𝐦𝐚 𝐝𝐢 𝐕𝐨𝐢𝐜𝐞-𝐂𝐡𝐚𝐧𝐧𝐞𝐥 𝐆𝐈𝐓𝐆𝐔𝐃`)
        .setDescription(leaderboardDescription || 'Tidak ada data yang tersedia.')
        .setColor(0x1abc9c)
        .setFooter({ text: 'Leaderboard direset setiap bulan.' })
        .setTimestamp();

    // Button untuk navigasi halaman
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('⬅️ Sebelumnya')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1),  // Disable button if it's the first page
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel(`Selanjutnya ➡️ (Page ${page}/${totalPages})`)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages)  // Disable button if it's the last page
        );

    const sentMessage = await channel.send({ embeds: [embed], components: [row] });

    const filter = (interaction) => interaction.user.id === client.user.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
        if (interaction.customId === 'previous') {
            await interaction.deferUpdate();
            sendLeaderboardPage(client, channel, sortedTimes, page - 1);
        } else if (interaction.customId === 'next') {
            await interaction.deferUpdate();
            sendLeaderboardPage(client, channel, sortedTimes, page + 1);
        }
    });
}

// Fungsi utama untuk mengirimkan leaderboard
async function sendLeaderboard(client) {
    const voiceTimes = loadVoiceTimes();

    if (Object.keys(voiceTimes).length === 0) {
        console.log('No data available for the leaderboard.');
        return;
    }

    const now = Date.now();

    // Iterate over the users and calculate the current session time if they're still in voice
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
        sendLeaderboardPage(client, channel, sortedTimes);
    } else {
        console.log('Leaderboard channel not found.');
    }
}

module.exports = { sendLeaderboard };