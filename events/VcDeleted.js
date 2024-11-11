const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelDelete',
    async execute(oldChannel, client) {
        if (!oldChannel.guild) return; // Pastikan event terjadi di dalam server (guild)
        if (oldChannel.type === 'GUILD_VOICE' || oldChannel.type === 2) {
            logChannelChange(client, channel.guild.id, 'Deleted', oldChannel.id, oldChannel.name);
            console.log(`Voice channel '${channel.name}' telah dihapus.`);
        }
    }
};