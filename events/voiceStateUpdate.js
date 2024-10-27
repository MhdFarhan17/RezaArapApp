const { loadVoiceTimes, saveVoiceTime } = require('./voiceTimes');
const { logVoiceChannelEvent } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');

let voiceTimes = {};
const excludedBots = ['Jockie Music', 'Jockie Music (1)', 'Jockie Music (2)'];

// Load initial voice times from the database
async function initializeVoiceTimes() {
    voiceTimes = await loadVoiceTimes();
}
initializeVoiceTimes();

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const member = newState.member || oldState.member;
        if (!member || !member.user || excludedBots.includes(member.user.username)) return;

        const guildId = member.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;
        if (!serverConfig) return;

        if (!voiceTimes[member.id]) {
            voiceTimes[member.id] = { totalTime: 0 };
        }

        const now = Date.now();
        const isMutedOrDeafened = newState.selfMute || newState.selfDeaf;

        // Member joins a voice channel, starts tracking only if not muted/deafened
        if (!oldState.channel && newState.channel) {
            if (!isMutedOrDeafened) {
                voiceTimes[member.id].joinTime = now;
                console.log(`Started tracking for ${member.user.tag}`);
            }
            logVoiceChannelEvent(client, guildId, 'Member Joined Voice Channel', member.user.tag, member.user.id, null, newState.channel.id);

        // Member leaves a voice channel, stop tracking and save session time
        } else if (oldState.channel && !newState.channel && voiceTimes[member.id].joinTime) {
            const sessionTime = now - voiceTimes[member.id].joinTime;
            voiceTimes[member.id].totalTime += sessionTime;
            await saveVoiceTime(member.id, voiceTimes[member.id].totalTime, null);
            delete voiceTimes[member.id].joinTime;
            console.log(`Stopped tracking for ${member.user.tag}. Session: ${sessionTime / 1000}s`);
            logVoiceChannelEvent(client, guildId, 'Member Left Voice Channel', member.user.tag, member.user.id, oldState.channel.id, null);

        // Member switches channels, save current session and start new if unmuted/undeafened
        } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            if (voiceTimes[member.id].joinTime) {
                const sessionTime = now - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                await saveVoiceTime(member.id, voiceTimes[member.id].totalTime, null);
                console.log(`Switching channels, saved time for ${member.user.tag}: ${sessionTime / 1000}s`);
            }
            voiceTimes[member.id].joinTime = isMutedOrDeafened ? null : now;
            logVoiceChannelEvent(client, guildId, 'Member Switched Voice Channels', member.user.tag, member.user.id, oldState.channel.id, newState.channel.id);

        // Member mutes/deafens, pause tracking
        } else if (oldState.selfMute !== newState.selfMute || oldState.selfDeaf !== newState.selfDeaf) {
            if (isMutedOrDeafened && voiceTimes[member.id].joinTime) {
                const sessionTime = now - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                await saveVoiceTime(member.id, voiceTimes[member.id].totalTime, null);
                delete voiceTimes[member.id].joinTime;
                console.log(`Paused tracking for ${member.user.tag}. Session: ${sessionTime / 1000}s`);
            } else if (!isMutedOrDeafened && !voiceTimes[member.id].joinTime) {
                voiceTimes[member.id].joinTime = now;
                console.log(`Resumed tracking for ${member.user.tag}`);
            }
        }
    }
};
