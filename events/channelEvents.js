const { logChannelChange } = require('../logs/moderationLog');

module.exports = {
    name: 'channelEvents',
    async channelCreate(channel, client) {
        if (!channel.guild) return;
        logChannelChange(client, channel.guild.id, 'Created', channel.id, channel.name);
        console.log(`Channel '${channel.name}' telah dibuat.`);
    },

    async channelDelete(channel, client) {
        if (!channel.guild) return;
        logChannelChange(client, channel.guild.id, 'Deleted', channel.id, channel.name || 'Unknown');
        console.log(`Channel '${channel.name || 'Unknown'}' telah dihapus.`);
    },

    async channelUpdate(oldChannel, newChannel, client) {
        if (!newChannel.guild) return;
    
        const permissionChanges = [];
    
        // Periksa perubahan izin (permission overwrites)
        const oldPermissions = oldChannel.permissionOverwrites.cache || new Map();
        const newPermissions = newChannel.permissionOverwrites.cache || new Map();
    
        // Bandingkan izin lama dan baru
        newPermissions.forEach((overwrite, id) => {
            const oldOverwrite = oldPermissions.get(id);
    
            if (!oldOverwrite || !oldOverwrite.equals(overwrite)) {
                const type = overwrite.type === 0 ? 'role' : 'user';
                const addedPermissions = overwrite.allow.toArray().map(perm => ({
                    type,
                    id,
                    permission: perm,
                    allow: true
                }));
                const removedPermissions = overwrite.deny.toArray().map(perm => ({
                    type,
                    id,
                    permission: perm,
                    allow: false
                }));
    
                permissionChanges.push(...addedPermissions, ...removedPermissions);
            }
        });
    
        if (permissionChanges.length > 0) {
            logChannelChange(client, newChannel.guild.id, 'Updated', newChannel.id, {
                permissionChanges
            });
            console.log(`Permissions pada channel '${newChannel.name}' telah diperbarui.`);
        }
    
        // Periksa perubahan nama channel
        if (oldChannel.name !== newChannel.name) {
            logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldChannel.name, newChannel.name);
            console.log(`Channel '${oldChannel.name}' diubah menjadi '${newChannel.name}'.`);
        }
    }    
    
};
