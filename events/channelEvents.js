const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelCreate',
    async execute(channel, client) {
        if (!channel.guild) return; // Pastikan event terjadi di dalam server (guild)
        logChannelChange(client, channel.guild.id, 'Created', channel.id, channel.name);
        console.log(`Channel '${channel.name}' telah dibuat.`);
    }
};

module.exports.channelUpdate = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {
        if (!newChannel.guild) return; // Pastikan event terjadi di dalam server (guild)

        const changes = [];
        if (oldChannel.name !== newChannel.name) {
            changes.push(`Name: ${oldChannel.name} ➔ ${newChannel.name}`);
        }
        if (oldChannel.topic !== newChannel.topic) {
            changes.push(`Topic: ${oldChannel.topic || 'None'} ➔ ${newChannel.topic || 'None'}`);
        }

        if (changes.length > 0) {
            logChannelChange(client, newChannel.guild.id, 'Updated', newChannel.id, changes.join('\n'));
            console.log(`Channel Updated: ${changes.join(', ')}`);
        }
    }
};

module.exports.channelDelete = {
    name: 'channelDelete',
    async execute(channel, client) {
        if (!channel.guild) return; // Pastikan event terjadi di dalam server (guild)

        // Jika nama channel tidak tersedia, gunakan fallback
        const channelName = channel.name || 'Unknown';
        logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channelName);
        console.log(`Channel '${channelName}' telah dihapus.`);
    }
};
