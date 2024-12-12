const { logChannelChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');

module.exports = {
    name: 'channelEvents',

    async channelCreate(channel, client) {
        if (!channel.guild) return;

        // Pastikan hanya untuk Server 1 dan Server 2
        if (![server1.guildId, server2.guildId].includes(channel.guild.id)) return;

        try {
            const channelName = channel.name || 'Unknown';
            logChannelChange(client, channel.guild.id, 'Created', channel.id, channelName);
            console.log(`Channel '${channelName}' telah dibuat di server '${channel.guild.name}'.`);
        } catch (error) {
            console.error(`Error processing created channel: ${error.message}`);
        }
    },

    async channelDelete(channel, client) {
        if (!channel.guild) return;

        // Pastikan hanya untuk Server 1 dan Server 2
        if (![server1.guildId, server2.guildId].includes(channel.guild.id)) return;

        try {
            const channelName = channel.name || 'Unknown';
            logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channelName);
            console.log(`Channel '${channelName}' telah dihapus dari server '${channel.guild.name}'.`);
        } catch (error) {
            console.error(`Error processing deleted channel: ${error.message}`);
        }
    },

    async channelUpdate(oldChannel, newChannel, client) {
        if (!newChannel.guild) return;

        // Pastikan hanya untuk Server 1 dan Server 2
        if (![server1.guildId, server2.guildId].includes(newChannel.guild.id)) return;

        try {
            // Perubahan nama channel
            if (oldChannel.name !== newChannel.name) {
                const oldName = oldChannel.name || 'Unknown';
                const newName = newChannel.name || 'Unknown';
                logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldName, newName);
                console.log(`Channel '${oldName}' diubah menjadi '${newName}' di server '${newChannel.guild.name}'.`);
            }
        } catch (error) {
            console.error(`Error processing updated channel: ${error.message}`);
        }
    }
};