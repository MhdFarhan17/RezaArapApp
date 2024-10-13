const fs = require('fs');
const path = require('path');
const { server1 } = require('../utils/constants');
const { logModerationAction } = require('../logs/moderationLog');

let voiceTimes = {};

// Load the saved voice times from a JSON file
function loadVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    if (fs.existsSync(filePath)) {
        try {
            voiceTimes = JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            console.error('Error parsing voiceTimes.json:', error);
            voiceTimes = {};
        }
    }
}

// Save the voice times to a JSON file with pretty formatting and sorted order
function saveVoiceTimes() {
    const filePath = path.join(__dirname, '..', 'logs', 'voiceTimes.json');
    try {
        // Sort voiceTimes by totalTime in descending order before saving
        const sortedVoiceTimes = Object.fromEntries(
            Object.entries(voiceTimes).sort(([, a], [, b]) => b.totalTime - a.totalTime)
        );
        fs.writeFileSync(filePath, JSON.stringify(sortedVoiceTimes, null, 4));
        console.log(`voiceTimes.json updated and saved.`);
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

        const guildId = member.guild.id;
        if (guildId !== server1.guildId) return;

        // Load voice times from file
        loadVoiceTimes();

        // Initialize the member's entry if it doesn't exist
        if (!voiceTimes[member.id]) {
            voiceTimes[member.id] = {
                totalTime: 0
            };
        }

        const channelNameOld = oldState.channel ? oldState.channel.name : null;
        const channelNameNew = newState.channel ? newState.channel.name : null;

        // Log actions for moderation
        if (!oldState.channel && newState.channel) {
            logModerationAction(client, guildId, 'Joined Voice Channel', member.user.tag, member.user.id, null, channelNameNew);
        } else if (oldState.channel && !newState.channel) {
            logModerationAction(client, guildId, 'Left Voice Channel', member.user.tag, member.user.id, channelNameOld, null);
        } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            logModerationAction(client, guildId, 'Switched Voice Channels', member.user.tag, member.user.id, channelNameOld, channelNameNew);
        }

        // Handling voice channel time tracking
        if (!oldState.channelId && newState.channelId) {
            // Member joined voice channel
            voiceTimes[member.id].joinTime = Date.now();
            console.log(`Started tracking time for ${member.user.tag}.`);

        } else if (oldState.channelId && !newState.channelId) {
            // Member left voice channel
            if (voiceTimes[member.id].joinTime && !newState.selfMute && !newState.selfDeaf) {
                const sessionTime = Date.now() - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                console.log(`Finished tracking for ${member.user.tag}. Session Time: ${sessionTime / 1000}s, Total Time: ${voiceTimes[member.id].totalTime / 1000}s`);
                delete voiceTimes[member.id].joinTime;
            }

        } else if (oldState.selfMute !== newState.selfMute || oldState.selfDeaf !== newState.selfDeaf) {
            // Handle mute or deafen events
            if (!newState.selfMute && !newState.selfDeaf && voiceTimes[member.id].joinTime) {
                // Unmute/undeafen, resume time tracking
                voiceTimes[member.id].joinTime = Date.now();
                console.log(`Resumed tracking for ${member.user.tag}.`);

            } else if ((newState.selfMute || newState.selfDeaf) && voiceTimes[member.id].joinTime) {
                // Mute or deafen, pause time tracking
                const sessionTime = Date.now() - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                console.log(`Paused tracking for ${member.user.tag}. Session Time: ${sessionTime / 1000}s, Total Time: ${voiceTimes[member.id].totalTime / 1000}s`);
                delete voiceTimes[member.id].joinTime;
            }
        }

        // Save updated voice times
        saveVoiceTimes();
    }
};
