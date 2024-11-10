const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    // Event untuk pembuatan channel
    name: 'channelCreate',
    async execute(channel, client) {
        if (!channel.guild) return; // Pastikan event terjadi di dalam server (guild)
        logChannelChange(client, channel.guild.id, 'Created', channel.id, channel.name);
        console.log(`Channel '${channel.name}' telah dibuat.`);
    },

    // Event untuk pembaruan channel
    channelUpdate: {
        name: 'channelUpdate',
        async execute(oldChannel, newChannel, client) {
            const oldName = oldChannel.name;
            const newName = newChannel.name;
            if (!newChannel.guild) return; // Pastikan event terjadi di dalam server (guild)
            if (oldChannel.name !== newChannel.name) {
                logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldName, newName);
                console.log(`Channel '${oldChannel.name}' diubah menjadi '${newChannel.name}'.`);
            }
        }
    },

    // Event untuk penghapusan channel
    channelDelete: {
        name: 'channelDelete',
        async execute(channel, client) {
            if (!channel.guild) return; // Pastikan event terjadi di dalam server (guild)
            logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channel.name);
            console.log(`Channel '${channel.name}' telah dihapus.`);
        }
    }
};
