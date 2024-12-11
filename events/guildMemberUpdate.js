const { logRoleChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');
const { EmbedBuilder } = require('discord.js');
const path = require('path');

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

        const wasBoosting = oldMember.premiumSince !== null;
        const isBoosting = newMember.premiumSince !== null;

        if (!wasBoosting && isBoosting && !boostedMembersCache.has(newMember.id)) {
            boostedMembersCache.add(newMember.id);
            const embed = new EmbedBuilder()
                .setColor(0xFF73FA) // Warna pink
                .setTitle('𝐁𝐎𝐎𝐒𝐓𝐄𝐑 𝐏𝐀𝐑𝐓𝐘')
                .setDescription(`**${newMember.user.tag}** just boosted the server! Thank you for your support!`)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setImage('attachment://booster.gif')
                .setFooter({ text: 'Server Boosted 🚀🚀🚀' })
                .setTimestamp();

            boostChannel.send({
                embeds: [embed],
                files: [{ attachment: path.join(__dirname, '../gifs', 'booster.gif'), name: 'booster.gif' }]
            });
        }

        if (wasBoosting && !isBoosting && boostedMembersCache.has(newMember.id)) {
            boostedMembersCache.delete(newMember.id);
            const embed = new EmbedBuilder()
                .setColor(0xFF0000) // Warna merah
                .setTitle('𝐁𝐨𝐨𝐬𝐭 𝐄𝐧𝐝𝐞𝐝')
                .setDescription(`**${newMember.user.tag}** has stopped boosting the server.`)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setImage('attachment://end.gif')
                .setFooter({ text: 'Server Boost Ended' })
                .setTimestamp();

            boostChannel.send({
                embeds: [embed],
                files: [{ attachment: path.join(__dirname, '../gifs', 'end.gif'), name: 'end.gif' }]
            });
        }
    }
};
