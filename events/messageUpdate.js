const { logMessageEdit } = require('../logs/moderationLog');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        // Abaikan pesan bot atau jika tidak ada perubahan yang signifikan
        if (newMessage.author.bot || oldMessage.content === newMessage.content) return;

        // Tentukan informasi yang diperlukan untuk log edit
        const guildId = newMessage.guild.id;
        const channelName = newMessage.channel.name;
        const authorTag = newMessage.author.tag;
        const authorId = newMessage.author.id;
        const oldContent = oldMessage.content || '[Attachment/No Content]';
        const newContent = newMessage.content || '[Attachment/No Content]';

        // Panggil fungsi logMessageEdit untuk mencatat perubahan
        logMessageEdit(client, guildId, authorTag, authorId, channelName, oldContent, newContent);
    }
};
