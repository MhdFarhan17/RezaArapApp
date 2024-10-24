const fs = require('fs');
const path = require('path');
const { server1, server2 } = require('../utils/constants');
const { logVoiceChannelEvent } = require('../logs/moderationLog');

let voiceTimes = {};
const excludedBots = ['Jockie Music', 'Jockie Music (1)', 'Jockie Music (2)'];

function loadVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    if (fs.existsSync(filePath)) {
        try {
            voiceTimes = JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            console.error('Error parsing voiceTimes.json:', error);
            voiceTimes = {};
        }
    } else {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }
}

function saveVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    const backupFilePath = path.join(__dirname, '..', 'logs', 'voiceTimes_backup.json');
    try {
        const sortedVoiceTimes = Object.fromEntries(
            Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime)
        );
        fs.writeFileSync(filePath, JSON.stringify(sortedVoiceTimes, null, 4));
        fs.writeFileSync(backupFilePath, JSON.stringify(sortedVoiceTimes, null, 4));
        console.log('voiceTimes.json updated and saved with a backup.');
    } catch (error) {
        console.error('Error saving voiceTimes.json:', error);
    }
}

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const member = newState.member || oldState.member;
        if (!member || !member.user) {
            console.error('Member or user is undefined in voiceStateUpdate');
            return;
        }

        if (excludedBots.includes(member.user.username)) {
            console.log(`Bot ${member.user.username} is excluded from tracking.`);
            return;
        }

        const guildId = member.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) {
            console.error(`Server with ID ${guildId} not found in configuration!`);
            return;
        }

        loadVoiceTimes();

        if (!voiceTimes[member.id]) {
            voiceTimes[member.id] = { totalTime: 0 };
        }

        const now = Date.now();
        const channelIdOld = oldState.channel ? oldState.channel.id : null;
        const channelIdNew = newState.channel ? newState.channel.id : null;

        // Logging voice channel activity
        if (!oldState.channel && newState.channel) {
            logVoiceChannelEvent(client, guildId, 'Member Joined Voice Channel', member.user.tag, member.user.id, null, channelIdNew);
        } else if (oldState.channel && !newState.channel) {
            logVoiceChannelEvent(client, guildId, 'Member Left Voice Channel', member.user.tag, member.user.id, channelIdOld, null);
        } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            logVoiceChannelEvent(client, guildId, 'Member Switched Voice Channels', member.user.tag, member.user.id, channelIdOld, channelIdNew);
        }

        // Time tracking logic
        if (!oldState.channelId && newState.channelId) {
            voiceTimes[member.id].joinTime = now;
            console.log(`Started tracking time for ${member.user.tag}.`);
        } else if (oldState.channelId && !newState.channelId) {
            if (voiceTimes[member.id].joinTime) {
                const sessionTime = now - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                console.log(`Finished tracking for ${member.user.tag}. Session Time: ${sessionTime / 1000}s, Total Time: ${voiceTimes[member.id].totalTime / 1000}s`);
                delete voiceTimes[member.id].joinTime;
            }
        } else if (oldState.selfMute !== newState.selfMute || oldState.selfDeaf !== newState.selfDeaf) {
            if (!newState.selfMute && !newState.selfDeaf && !voiceTimes[member.id].joinTime) {
                voiceTimes[member.id].joinTime = now;
                console.log(`Resumed tracking for ${member.user.tag}.`);
            } else if ((newState.selfMute || newState.selfDeaf) && voiceTimes[member.id].joinTime) {
                const sessionTime = now - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                console.log(`Paused tracking for ${member.user.tag}. Session Time: ${sessionTime / 1000}s, Total Time: ${voiceTimes[member.id].totalTime / 1000}s`);
                delete voiceTimes[member.id].joinTime;
            }
        }

        saveVoiceTimes();
    }
};
