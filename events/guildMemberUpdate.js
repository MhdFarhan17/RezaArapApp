const { logRoleChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        const guildId = newMember.guild.id;

        if (![server1.guildId, server2.guildId].includes(guildId)) return;

        const oldRoles = new Set(oldMember.roles.cache.map(role => role.id));
        const newRoles = new Set(newMember.roles.cache.map(role => role.id));

        for (const roleId of newRoles) {
            if (!oldRoles.has(roleId)) {
                const roleName = newMember.guild.roles.cache.get(roleId)?.name || 'Unknown';
                logRoleChange(client, guildId, newMember.user.tag, newMember.user.id, roleName, 'Added');
            }
        }

        for (const roleId of oldRoles) {
            if (!newRoles.has(roleId)) {
                const roleName = oldMember.guild.roles.cache.get(roleId)?.name || 'Unknown';
                logRoleChange(client, guildId, oldMember.user.tag, oldMember.user.id, roleName, 'Removed');
            }
        }
    }
};

