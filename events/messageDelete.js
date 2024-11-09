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
        const channelId = message.channel ? message.channel.id : 'Unknown';
        const authorId = message.author ? message.author.id : 'Unknown User';
        const content = message.content ? message.content : '[Attachment/No Content]';

        logMessageDelete(message.client, guildId, authorId, channelId, content);
    }
};