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
        const oldName = oldChannel.name;
        const newName = newChannel.name;
        
        if (oldName !== newName) {
            logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, `${oldName} ➔ ${newName}`);
            console.log(`Channel '${oldName}' diubah menjadi '${newName}'.`);
        }
    }
};

module.exports.channelDelete = {
    name: 'channelDelete',
    async execute(channel, client) {
        if (!channel.guild) return; // Pastikan event terjadi di dalam server (guild)
        logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channel.name);
        console.log(`Channel '${channel.name}' telah dihapus.`);
    }
};
