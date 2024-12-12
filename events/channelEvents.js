const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelEvents',

    // Event untuk channel dibuat
    async channelCreate(channel, client) {
        if (!channel.guild) return; // Abaikan jika bukan dalam server

        try {
            // Menggunakan nama channel langsung
            const channelName = channel.name || 'Unknown';
            
            // Log event channel dibuat
            logChannelChange(client, channel.guild.id, 'Created', channel.id, channelName);
            console.log(`Channel '${channelName}' telah dibuat.`);
        } catch (error) {
            console.error(`Error handling channelCreate: ${error.message}`);
        }
    },

    // Event untuk channel dihapus
    async channelDelete(channel, client) {
        if (!channel.guild) return; // Abaikan jika bukan dalam server

        try {
            // Channel yang dihapus tidak punya name, fallback ke 'Unknown'
            const channelName = channel.name || 'Unknown';
            
            // Log event channel dihapus
            logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channelName);
            console.log(`Channel '${channelName}' telah dihapus.`);
        } catch (error) {
            console.error(`Error handling channelDelete: ${error.message}`);
        }
    },

    // Event untuk channel diupdate (ganti nama)
    async channelUpdate(oldChannel, newChannel, client) {
        if (!newChannel.guild) return; // Abaikan jika bukan dalam server

        try {
            // Deteksi perubahan nama channel
            if (oldChannel.name !== newChannel.name) {
                const oldName = oldChannel.name || 'Unknown';
                const newName = newChannel.name || 'Unknown';

                // Log perubahan nama channel
                logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldName, newName);
                console.log(`Channel '${oldName}' diubah menjadi '${newName}'.`);
            }
        } catch (error) {
            console.error(`Error handling channelUpdate: ${error.message}`);
        }
    }
};
