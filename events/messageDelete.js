const { logModerationAction } = require('../logs/moderationLog');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        // Jika pesan bersifat parsial, ambil datanya terlebih dahulu
        if (message.partial) {
            try {
                await message.fetch();
            } catch (error) {
                console.error('Pesan tidak dapat diambil sepenuhnya:', error);
                return;
            }
        }

        // Ambil informasi yang diperlukan untuk log moderasi
        const guildId = message.guild.id;
        const channelName = message.channel ? message.channel.name : 'Unknown';
        const authorTag = message.author ? message.author.tag : 'Unknown';
        const authorId = message.author ? message.author.id : 'Unknown';
        const content = message.content ? message.content : '[Attachment/No Content]';

        // Panggil fungsi logModerationAction dengan parameter client untuk mencatat di channel moderasi
        logModerationAction(message.client, guildId, 'Pesan Dihapus', authorTag, authorId, channelName, null, content);
    }
};
