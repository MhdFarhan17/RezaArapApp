const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { server1 } = require('../utils/constants');

function loadVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    const backupFilePath = path.join(__dirname, '..', 'logs', 'voiceTimes_backup.json');

    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading voiceTimes.json, attempting to load backup:', error);
            // Attempt to load from the backup
            if (fs.existsSync(backupFilePath)) {
                try {
                    const backupData = fs.readFileSync(backupFilePath, 'utf-8');
                    return JSON.parse(backupData);
                } catch (backupError) {
                    console.error('Error reading voiceTimes_backup.json:', backupError);
                    return {};
                }
            }
            return {};
        }
    } else {
        fs.writeFileSync(filePath, JSON.stringify({}));
        return {};
    }
}

function saveVoiceTimes(voiceTimes) {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    const backupFilePath = path.join(__dirname, '..', 'logs', 'voiceTimes_backup.json');
    try {
        const sortedVoiceTimes = Object.fromEntries(
            Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime)
        );
        fs.writeFileSync(filePath, JSON.stringify(sortedVoiceTimes, null, 4));
        fs.writeFileSync(backupFilePath, JSON.stringify(sortedVoiceTimes, null, 4)); // Backup
        console.log('voiceTimes.json updated and saved, backup created.');
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

async function sendLeaderboardPage(client, channel, sortedTimes, page = 1, perPage = 10) {
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

    let components = [];
    if (sortedTimes.length > 10) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`previous_page_${page}`)
                    .setLabel('⬅️ Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setLabel(`Page ${page} of ${totalPages}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`next_page_${page}`)
                    .setLabel('Next ➡️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === totalPages)
            );
        components = [row];
    }

    try {
        const sentMessage = await channel.send({ embeds: [embed], components });

        if (sortedTimes.length > 10) {
            const filter = (interaction) => interaction.isButton();
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === `previous_page_${page}`) {
                    await interaction.deferUpdate();
                    sendLeaderboardPage(client, channel, sortedTimes, page - 1);
                } else if (interaction.customId === `next_page_${page}`) {
                    await interaction.deferUpdate();
                    sendLeaderboardPage(client, channel, sortedTimes, page + 1);
                }
            });

            collector.on('end', async () => {
                try {
                    const disabledRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous')
                            .setLabel('⬅️ Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel(`Page ${page} of ${totalPages}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next ➡️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    );
                    await sentMessage.edit({ components: [disabledRow] });
                } catch (error) {
                    console.error('Failed to disable buttons:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error sending leaderboard message:', error);
    }
}

async function sendLeaderboard(client) {
    const voiceTimes = loadVoiceTimes();

    if (Object.keys(voiceTimes).length === 0) {
        console.log('No data available for the leaderboard.');
        return;
    }

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
            await sendLeaderboardPage(client, channel, sortedTimes);
        } catch (error) {
            console.error('Error sending leaderboard:', error);
        }
    } else {
        console.log('Leaderboard channel not found.');
    }
}

module.exports = { sendLeaderboard };