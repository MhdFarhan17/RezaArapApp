const { logRoleChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');
const { EmbedBuilder } = require('discord.js');
const path = require('path');

const boostedMembersCache = new Map();

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

        // Notifikasi untuk member yang baru boost server
        if (!wasBoosting && isBoosting && !boostedMembersCache.has(newMember.id)) {
            const boostTimestamp = Math.floor(newMember.premiumSince / 1000);
            boostedMembersCache.set(newMember.id, boostTimestamp);

            const embed = new EmbedBuilder()
                .setColor(0xFF73FA)
                .setAuthor({
                    name: `${newMember.user.username}`,
                    iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`Thank you **${newMember.user.username}** for boosting the server! Your support helps us grow!`)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setImage('attachment://booster.gif')
                .setFooter({ text: 'Server Boosted 🚀🚀🚀', iconURL: 'https://tenor.com/bWaS6.gif' })
                .setTimestamp();

            boostChannel.send({
                embeds: [embed],
                files: [{ attachment: path.join(__dirname, '../gifs', 'booster.gif'), name: 'booster.gif' }]
            });
        }

        // Notifikasi untuk member yang berhenti boost server
        if (wasBoosting && !isBoosting && boostedMembersCache.has(newMember.id)) {
            boostedMembersCache.delete(newMember.id);

            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setAuthor({
                    name: `${newMember.user.username}`,
                    iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`**${newMember.user.username}**, thank you for supporting us in the past! We hope to see you back soon!`)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setImage('attachment://end.gif')
                .setFooter({ text: 'Boost Ended 🚫', iconURL: 'https://tenor.com/biYQD.gif' })
                .setTimestamp();

            boostChannel.send({
                embeds: [embed],
                files: [{ attachment: path.join(__dirname, '../gifs', 'end.gif'), name: 'end.gif' }]
            });
        }

        // Notifikasi untuk member yang memperpanjang atau memulai periode boost baru
        if (isBoosting) {
            const currentBoostTimestamp = Math.floor(newMember.premiumSince / 1000);
            const cachedBoostTimestamp = boostedMembersCache.get(newMember.id);

            if (!cachedBoostTimestamp || currentBoostTimestamp > cachedBoostTimestamp) {
                boostedMembersCache.set(newMember.id, currentBoostTimestamp);

                const embed = new EmbedBuilder()
                    .setColor(0xFF73FA)
                    .setAuthor({
                        name: `${newMember.user.username}`,
                        iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                    })
                    .setDescription(`**${newMember.user.username}**, thank you for renewing your support! We’re so grateful to have you!`)
                    .addFields(
                        { name: 'Boost Active Since', value: `<t:${boostTimestamp}:R>` },
                        { name: 'Server', value: member.guild.name, inline: true }
                    )
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                    .setImage('attachment://booster.gif')
                    .setFooter({ text: 'Server Boosted 🚀🚀🚀', iconURL: 'https://tenor.com/pzNNdrPTVgw.gif' })
                    .setTimestamp();

                boostChannel.send({
                    embeds: [embed],
                    files: [{ attachment: path.join(__dirname, '../gifs', 'booster.gif'), name: 'booster.gif' }]
                });
            }
        }
    }
};
