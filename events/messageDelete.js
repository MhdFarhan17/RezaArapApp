const { logMessageDelete } = require('../logs/moderationLog');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        if (message.partial) {
            try {
                await message.fetch();
            } catch (error) {
                console.error('Pesan tidak dapat diambil sepenuhnya:', error);
                return;
            }
        }

        const guildId = message.guild ? message.guild.id : 'Unknown Guild';
        const channelName = message.channel ? message.channel.name : 'Unknown';
        const authorTag = message.author ? message.author.tag : 'Unknown User';
        const authorId = message.author ? message.author.id : 'Unknown User';
        const content = message.content ? message.content : '[Attachment/No Content]';

        logMessageDelete(message.client, guildId, authorTag, authorId, channelName, content);
    }
};
