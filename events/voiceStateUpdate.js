const fs = require('fs');
const path = require('path');
const { server1, server2 } = require('../utils/constants');
const { logModerationAction } = require('../logs/moderationLog');

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
        // Ensure that the file exists by creating an empty object
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
        // Create a backup
        fs.writeFileSync(backupFilePath, JSON.stringify(sortedVoiceTimes, null, 4));
        console.log(`voiceTimes.json updated and saved with a backup.`);
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

        // Exclude bots from tracking
        if (excludedBots.includes(member.user.username)) {
            console.log(`Bot ${member.user.username} is excluded from tracking.`);
            return;
        }

        const guildId = member.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        // Ensure server configuration exists
        if (!serverConfig) {
            console.error(`Server with ID ${guildId} not found in configuration!`);
            return;
        }

        loadVoiceTimes();

        // Initialize user voice tracking data if not present
        if (!voiceTimes[member.id]) {
            voiceTimes[member.id] = { totalTime: 0 };
        }

        const now = Date.now();
        const channelNameOld = oldState.channel ? oldState.channel.name : null;
        const channelNameNew = newState.channel ? newState.channel.name : null;

        // Logging voice channel join/leave/switch
        if (!oldState.channel && newState.channel) {
            logModerationAction(client, guildId, 'User Joined Voice Channel', member.user.tag, member.user.id, null, channelNameNew);
        } else if (oldState.channel && !newState.channel) {
            logModerationAction(client, guildId, 'User Left Voice Channel', member.user.tag, member.user.id, channelNameOld, null);
        } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            logModerationAction(client, guildId, 'User Switched Voice Channels', member.user.tag, member.user.id, channelNameOld, channelNameNew);
        }

        // Tracking user voice time
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
                // Resumed tracking when unmute/undeafen
                voiceTimes[member.id].joinTime = now;
                console.log(`Resumed tracking for ${member.user.tag}.`);
            } else if ((newState.selfMute || newState.selfDeaf) && voiceTimes[member.id].joinTime) {
                // Paused tracking when mute/deafen
                const sessionTime = now - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                console.log(`Paused tracking for ${member.user.tag}. Session Time: ${sessionTime / 1000}s, Total Time: ${voiceTimes[member.id].totalTime / 1000}s`);
                delete voiceTimes[member.id].joinTime;
            }
        }

        // Always save the latest voiceTimes data
        saveVoiceTimes();
    }
};
