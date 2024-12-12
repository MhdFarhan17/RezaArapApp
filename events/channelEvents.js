const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelEvents',
    async channelCreate(channel, client) {
        if (!channel.guild) return;
    
        try {
            const fetchedChannel = await client.channels.fetch(channel.id).catch(() => null);
            const channelName = fetchedChannel ? fetchedChannel.name : channel.name || 'Unknown';
    
            logChannelChange(client, channel.guild.id, 'Created', channel.id, channelName);
            console.log(`Channel '${channelName}' telah dibuat.`);
        } catch (error) {
            console.error(`Error fetching created channel: ${error.message}`);
        }
    },

    async channelDelete(channel, client) {
        if (!channel.guild) return;
    
        try {
            const fetchedChannel = await client.channels.fetch(channel.id).catch(() => null);
            const channelName = fetchedChannel ? fetchedChannel.name : channel.name || 'Unknown';
    
            logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channelName);
            console.log(`Channel '${channelName}' telah dihapus.`);
        } catch (error) {
            console.error(`Error fetching deleted channel: ${error.message}`);
        }
    },

    async channelUpdate(oldChannel, newChannel, client) {
        if (!newChannel.guild) return;
    
        const permissionChanges = [];
    
        // Membandingkan permissionOverwrites secara manual
        const oldPermissions = oldChannel.permissionOverwrites?.cache || new Map();
        const newPermissions = newChannel.permissionOverwrites?.cache || new Map();
    
        newPermissions.forEach((overwrite, id) => {
            const oldOverwrite = oldPermissions.get(id);
            if (!oldOverwrite || !oldOverwrite.equals(overwrite)) {
                const type = overwrite.type === 0 ? 'role' : 'user';
                const changes = overwrite.allow.toArray().map(perm => ({ type, id, permission: perm, allow: true }))
                    .concat(overwrite.deny.toArray().map(perm => ({ type, id, permission: perm, allow: false })));
                permissionChanges.push(...changes);
            }
        });
    
        // Log perubahan izin
        if (permissionChanges.length > 0) {
            logChannelChange(client, newChannel.guild.id, 'Updated', newChannel.id, { permissionChanges });
            console.log(`Permissions pada channel '${newChannel.name}' telah diperbarui.`);
        }
    
        // Log perubahan nama channel
        if (oldChannel.name !== newChannel.name) {
            logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldChannel.name, newChannel.name);
            console.log(`Channel '${oldChannel.name}' diubah menjadi '${newChannel.name}'.`);
        }
    }    
    
};
