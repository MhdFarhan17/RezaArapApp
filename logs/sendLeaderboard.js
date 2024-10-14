const { EmbedBuilder } = require('discord.js');
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
    return `      ${hours} jam, ${minutes} menit, ${seconds} detik`;
}

async function sendLeaderboard(client) {
    const voiceTimes = loadVoiceTimes();

    if (Object.keys(voiceTimes).length === 0) {
        console.log('No data available for the leaderboard.');
        return;
    }

    const now = Date.now();

    // Iterate over the users and calculate the current session time if they're still in voice
    for (const [userId, data] of Object.entries(voiceTimes)) {
        // Jika user masih berada di voice channel, hitung waktu dari joinTime ke waktu sekarang
        if (data.joinTime) {
            const currentSessionTime = now - data.joinTime;  // Hitung selisih waktu
            voiceTimes[userId].totalTime += currentSessionTime; // Tambahkan ke totalTime
            voiceTimes[userId].joinTime = now; // Update joinTime ke waktu sekarang (untuk sesi berikutnya)
        }
    }

    // Simpan voiceTimes yang sudah diperbarui
    saveVoiceTimes(voiceTimes);

    // Sort members by total time in descending order
    const sortedTimes = Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime);

    let leaderboardDescription = '';
    for (let i = 0; i < sortedTimes.length && i < 10; i++) {
        const [userId, { totalTime }] = sortedTimes[i];
        const user = await client.users.fetch(userId);
        leaderboardDescription += `**${i + 1}. ${user.tag}**\n  ${formatTime(totalTime)}\n\n=====================\n`;
    }

    const embed = new EmbedBuilder()
        .setTitle('Leaderboard Terlama di Voice Channel\n')
        .setDescription(leaderboardDescription || 'Tidak ada data yang tersedia.')
        .setColor(0x1abc9c)
        .setFooter({ text: 'Leaderboard direset setiap bulan.' })
        .setTimestamp();

    const channel = client.channels.cache.get(server1.leaderboardChannelId);
    if (channel) {
        channel.send({ embeds: [embed] });
    } else {
        console.log('Leaderboard channel not found.');
    }
}

module.exports = { sendLeaderboard };
