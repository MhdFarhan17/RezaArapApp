const { logMessageEdit } = require('../logs/moderationLog');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (newMessage.author.bot || oldMessage.content === newMessage.content) return;

        const guildId = newMessage.guild.id;
        const channelName = newMessage.channel.name;
        const authorTag = newMessage.author.tag;
        const authorId = newMessage.author.id;
        const oldContent = oldMessage.content || '[Attachment/No Content]';
        const newContent = newMessage.content || '[Attachment/No Content]';

        logMessageEdit(client, guildId, authorTag, authorId, channelName, oldContent, newContent);
    }
};
