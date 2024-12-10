const { logRoleChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');
const { EmbedBuilder } = require('discord.js');

const boostedMembersCache = new Set();

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        const guildId = newMember.guild.id;

        if (![server1.guildId, server2.guildId].includes(guildId)) return;

        const serverConfig = guildId === server1.guildId ? server1 : server2;
        const boostChannelId = serverConfig.boostChannelId;
        const boostChannel = newMember.guild.channels.cache.get(boostChannelId);

        if (!boostChannel) return;

        const oldRoles = new Set(oldMember.roles.cache.map(role => role.id));
        const newRoles = new Set(newMember.roles.cache.map(role => role.id));

        for (const roleId of newRoles) {
            if (!oldRoles.has(roleId)) {
                const role = newMember.guild.roles.cache.get(roleId);
                const roleName = role ? role.name : 'Unknown';

                logRoleChange(client, guildId, newMember.user.tag, newMember.user.id, roleName, roleId, 'Added');
            }
        }

        for (const roleId of oldRoles) {
            if (!newRoles.has(roleId)) {
                const role = oldMember.guild.roles.cache.get(roleId);
                const roleName = role ? role.name : 'Unknown';

                logRoleChange(client, guildId, oldMember.user.tag, oldMember.user.id, roleName, roleId, 'Removed');
            }
        }

        const wasBoosting = oldMember.premiumSince !== null;
        const isBoosting = newMember.premiumSince !== null;

        // Jika member mulai boost
        if (!wasBoosting && isBoosting && !boostedMembersCache.has(newMember.id)) {
            boostedMembersCache.add(newMember.id); // Tambahkan ke cache
            const embed = new EmbedBuilder()
                .setColor(0xFF73FA) // Warna pink
                .setTitle('🎉 🎊 BOOSTER PARTY 🎊 🎉')
                .setDescription(`**${newMember.user.tag}** just boosted the server! Thank you for your support!`)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setImage('attachment://boost.gif')
                .setFooter({ text: 'Server Boosted 🚀' })
                .setTimestamp();

            boostChannel.send({ embeds: [embed] });
        }

        // Jika member berhenti boost
        if (wasBoosting && !isBoosting) {
            boostedMembersCache.delete(newMember.id); // Hapus dari cache
            const embed = new EmbedBuilder()
                .setColor(0xFF0000) // Warna merah
                .setTitle('😢 Boost Ended')
                .setDescription(`**${newMember.user.tag}** has stopped boosting the server.`)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setImage('attachment://boost.gif')
                .setFooter({ text: 'Server Boost Removed' })
                .setTimestamp();

            boostChannel.send({ embeds: [embed] });
        }
    }
};
