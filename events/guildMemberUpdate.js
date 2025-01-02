const { logRoleChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');
const { EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

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

        for (const roleId of newRoles) {
            if (!oldRoles.has(roleId)) {
                const role = newMember.guild.roles.cache.get(roleId);
                const roleName = role ? role.name : 'Unknown';
                logRoleChange(client, guildId, newMember.user.id, roleName, 'Added');
            }
        }

        for (const roleId of oldRoles) {
            if (!newRoles.has(roleId)) {
                const role = oldMember.guild.roles.cache.get(roleId);
                const roleName = role ? role.name : 'Unknown';
                logRoleChange(client, guildId, oldMember.user.id, roleName, 'Removed');
            }
        }

        const wasBoosting = oldMember.premiumSince !== null;
        const isBoosting = newMember.premiumSince !== null;

        if (!wasBoosting && isBoosting && !boostedMembersCache.has(newMember.id)) {
            const boostTimestamp = Math.floor(newMember.premiumSince / 1000);
            boostedMembersCache.set(newMember.id, boostTimestamp);

            const embed = new EmbedBuilder()
                .setColor(0xFF73FA)
                .setAuthor({
                    name: `${newMember.user.username}`,
                    iconURL: newMember.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`Thank you **${newMember.user.username}** for boosting the server!`)
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: 'Server Boosted 🚀🚀🚀' })
                .setTimestamp();

            const boosterGifPath = path.join(__dirname, '../gifs', 'booster.gif');
            if (fs.existsSync(boosterGifPath)) {
                boostChannel.send({
                    embeds: [embed],
                    files: [{ attachment: boosterGifPath, name: 'booster.gif' }]
                });
            } else {
                console.error('File booster.gif tidak ditemukan!');
                boostChannel.send({ embeds: [embed] });
            }
        }

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
                .setFooter({ text: 'Boost Ended 🚫' })
                .setTimestamp();

            boostChannel.send({ embeds: [embed] });
        }

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
                        { name: 'Boost Active Since', value: `<t:${currentBoostTimestamp}:R>` },
                        { name: 'Server', value: newMember.guild.name, inline: true }
                    )
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({ text: 'Server Boosted 🚀🚀🚀' })
                    .setTimestamp();

                boostChannel.send({ embeds: [embed] });
            }
        }
    }
};