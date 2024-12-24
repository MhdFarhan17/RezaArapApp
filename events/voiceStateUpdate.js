const { loadVoiceTimes, saveVoiceTime } = require('../utils/voiceTimes');
const { logVoiceChannelEvent } = require('../logs/moderationLog');
const { server1 } = require('../utils/constants');
const { ChannelType } = require('discord.js');

let voiceTimes = {};
const excludedBots = ['Jockie Music', 'Jockie Music (1)', 'Jockie Music (2)'];

async function initializeVoiceTimes(client) {
    voiceTimes = await loadVoiceTimes();
    const guild = client.guilds.cache.get(server1.guildId);

    if (!guild) {
        console.warn(`Guild dengan ID ${server1.guildId} tidak ditemukan selama inisialisasi.`);
        return;
    }

    guild.channels.cache
        .filter(channel => channel.type === ChannelType.GuildVoice)
        .forEach(voiceChannel => {
            voiceChannel.members.forEach(member => {
                if (excludedBots.includes(member.user.username)) return;

                if (!voiceTimes[member.id]) {
                    voiceTimes[member.id] = { totalTime: 0 };
                }

                if (!member.voice.selfMute && !member.voice.selfDeaf) {
                    voiceTimes[member.id].joinTime = Date.now();
                    console.log(`Resumed tracking for ${member.user.tag} on bot restart.`);
                }
            });
        });
}

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const member = newState.member || oldState.member;
        if (!member || !member.user || excludedBots.includes(member.user.username)) return;

        const guildId = member.guild.id;

        // Hanya jalankan jika guild adalah server1
        if (guildId !== server1.guildId) return;

        if (!voiceTimes[member.id]) {
            voiceTimes[member.id] = { totalTime: 0 };
        }

        const now = Date.now();
        const isMutedOrDeafened = newState.selfMute || newState.selfDeaf;

        // Member joins a voice channel
        if (!oldState.channel && newState.channel) {
            voiceTimes[member.id].joinTime = now;
            console.log(`Started tracking for ${member.user.tag}`);
            logVoiceChannelEvent(client, guildId, 'Joined Voice Channel', member.user.id, null, newState.channel.id);

        // Member leaves a voice channel
        } else if (oldState.channel && !newState.channel) {
            if (voiceTimes[member.id].joinTime) {
                const sessionTime = now - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                await saveVoiceTime(member.id, voiceTimes[member.id].totalTime, null);
                delete voiceTimes[member.id].joinTime;
                console.log(`Stopped tracking for ${member.user.tag}. Session: ${sessionTime / 1000}s`);
            }
            logVoiceChannelEvent(client, guildId, 'Left Voice Channel', member.user.id, oldState.channel.id, null);

        // Member switches between voice channels
        } else if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            if (voiceTimes[member.id].joinTime) {
                const sessionTime = now - voiceTimes[member.id].joinTime;
                voiceTimes[member.id].totalTime += sessionTime;
                await saveVoiceTime(member.id, voiceTimes[member.id].totalTime, null);
                console.log(`Switching channels, saved time for ${member.user.tag}: ${sessionTime / 1000}s`);
            }

            voiceTimes[member.id].joinTime = now;
            console.log(`Member ${member.user.tag} moved from ${oldState.channel.name} to ${newState.channel.name}`);
            logVoiceChannelEvent(client, guildId, 'Switched Voice Channels', member.user.id, oldState.channel.id, newState.channel.id);

        // Member mutes or unmutes themselves
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
    },

    initializeVoiceTimes
};
