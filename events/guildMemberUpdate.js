const { logRoleChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        const guildId = newMember.guild.id;

        // Periksa apakah guild termasuk dalam server yang dipantau
        if (![server1.guildId, server2.guildId].includes(guildId)) return;

        const oldRoles = new Set(oldMember.roles.cache.map(role => role.id));
        const newRoles = new Set(newMember.roles.cache.map(role => role.id));

        // Periksa role yang ditambahkan
        for (const roleId of newRoles) {
            if (!oldRoles.has(roleId)) {
                const role = newMember.guild.roles.cache.get(roleId);
                const roleName = role ? role.name : 'Unknown';

                logRoleChange(client, guildId, newMember.user.tag, newMember.user.id, roleName, roleId, 'Added');
            }
        }

        // Periksa role yang dihapus
        for (const roleId of oldRoles) {
            if (!newRoles.has(roleId)) {
                const role = oldMember.guild.roles.cache.get(roleId);
                const roleName = role ? role.name : 'Unknown';

                logRoleChange(client, guildId, oldMember.user.tag, oldMember.user.id, roleName, roleId, 'Removed');
            }
        }
    }
};
