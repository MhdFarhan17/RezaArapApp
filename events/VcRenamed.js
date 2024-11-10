const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {
        if (!newChannel.guild) return; // Pastikan event terjadi di dalam server (guild)
        if (oldChannel.type === 'GUILD_VOICE' && newChannel.type === 'GUILD_VOICE') { // Hanya untuk voice channel
            if (oldChannel.name !== newChannel.name) {
                const oldName = oldChannel.name;
                const newName = newChannel.name;
                // const beforeAfterName = `Before: ${oldChannel.name} ➔ After: ${newChannel.name}`;
                logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldName, newName);
                console.log(`Voice channel '${oldChannel.name}' diubah menjadi '${newChannel.name}'.`);
            }
        }
    }
};
