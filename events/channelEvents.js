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

        if (!oldChannel.permissionOverwrites.equals(newChannel.permissionOverwrites)) {
            newChannel.permissionOverwrites.cache.forEach((overwrite, id) => {
                const oldOverwrite = oldChannel.permissionOverwrites.cache.get(id);
                if (!oldOverwrite || !oldOverwrite.equals(overwrite)) {
                    const type = overwrite.type === 0 ? 'role' : 'user';
                    const changes = overwrite.allow.toArray().map(perm => ({ type, id, permission: perm, allow: true }))
                        .concat(overwrite.deny.toArray().map(perm => ({ type, id, permission: perm, allow: false })));
                    permissionChanges.push(...changes);
                }
            });
        }

        if (permissionChanges.length > 0) {
            logChannelChange(client, newChannel.guild.id, 'Updated', newChannel.id, { permissionChanges });
            console.log(`Permissions pada channel '${newChannel.name}' telah diperbarui.`);
        }

        if (oldChannel.name !== newChannel.name) {
            logChannelChange(client, newChannel.guild.id, 'Renamed', newChannel.id, oldChannel.name, newChannel.name);
            console.log(`Channel '${oldChannel.name}' diubah menjadi '${newChannel.name}'.`);
        }
    }
    
};
