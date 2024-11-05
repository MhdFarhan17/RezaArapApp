const { logChannelChange } = require('../logs/moderationLog');
const { server1, server2 } = require('../utils/constants');

module.exports = {
    name: 'voiceChannelDelete',
    async execute(oldState) {
        const channel = oldState.channel;
        const guildId = oldState.guild.id;
        const serverConfig = guildId === server1.guildId ? server1 : guildId === server2.guildId ? server2 : null;

        if (!serverConfig) return;

        if (channel && channel.members.size === 0 && channel.parentId === serverConfig.tempVoiceCategoryId) {
            setTimeout(async () => {
                const updatedChannel = oldState.guild.channels.cache.get(channel.id);
                
                if (updatedChannel && updatedChannel.members.size === 0) {
                    try {
                        await updatedChannel.delete();
                        console.log(`Temporary voice channel '${updatedChannel.name}' has been deleted due to inactivity.`);
                        logChannelChange(oldState.client, guildId, 'Deleted', updatedChannel.name, updatedChannel.id);
                    } catch (error) {
                        console.error(`Failed to delete channel '${updatedChannel.name}':`, error);
                    }
                } else {
                    console.log(`Channel '${channel.name}' is no longer empty or has been deleted.`);
                }
            }, 300000); // 5 menit
        }
    },
};
