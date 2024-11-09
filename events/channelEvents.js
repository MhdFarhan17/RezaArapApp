const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelCreate',
    async execute(channel, client) {
        logChannelChange(client, channel.guild.id, 'Created', channel.id);
        console.log(`Channel '${channel.name}' telah dibuat.`);
    }
};

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client) {
        if (oldChannel.name !== newChannel.name) {
            logChannelChange(client, newChannel.guild.id, `Renamed to ${newChannel.name}`, newChannel.id);
            console.log(`Channel '${oldChannel.name}' diubah menjadi '${newChannel.name}'.`);
        }
    }
};

module.exports = {
    name: 'channelDelete',
    async execute(channel, client) {
        logChannelChange(client, channel.guild.id, 'Deleted', channel.id);
        console.log(`Channel '${channel.name}' telah dihapus.`);
    }
};
