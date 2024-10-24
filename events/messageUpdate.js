const { logMessageEdit } = require('../logs/moderationLog');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (newMessage.author.bot || oldMessage.content === newMessage.content) return;

        const guildId = newMessage.guild.id;
        const channelName = newMessage.channel.name;  // Keep channelName as the name of the channel
        const authorTag = newMessage.author.tag;
        const authorId = newMessage.author.id;
        const oldContent = oldMessage.content || '[Attachment/No Content]';  // Correct old content
        const newContent = newMessage.content || '[Attachment/No Content]';

        logMessageEdit(client, guildId, authorTag, authorId, channelName, oldContent, newContent);
    }
};
