const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelDelete',
    async execute(channel, client) {
        if (!channel.guild) return; // Pastikan event terjadi di dalam server (guild)
        if (channel.type === 'GUILD_VOICE') { // Hanya untuk voice channel
            logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channel.name);
            console.log(`Voice channel '${channel.name}' telah dihapus.`);
        }
    }
};