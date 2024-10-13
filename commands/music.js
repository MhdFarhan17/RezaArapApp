const { logModerationAction } = require('../logs/moderationLog');

module.exports = {
    handleMusicRequest(client, message) {
        const content = message.content.toLowerCase();
        const isYouTubeLink = /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(content);
        const isSpotifyLink = /https?:\/\/(open\.spotify\.com)\/.+/.test(content);
        const isMusicCommand = ['m!play', 'm!p', 'm!s', 'm!skip', 'm!leave', 'm!stop', 'm!resume'].some(command => content.startsWith(command));

        if (!isYouTubeLink && !isSpotifyLink && !isMusicCommand) {
            message.delete().then(() => {
                message.channel.send(`${message.author}, di channel ini hanya diperbolehkan mengirim link YouTube, Spotify, atau menggunakan perintah musik yang valid.`)
                    .then(sentMessage => setTimeout(() => sentMessage.delete(), 60000))
                    .catch(console.error);
                logModerationAction(client, message.guild.id, 'Penghapusan Pesan di Channel Request Musik', message.author.tag, message.author.id, message.channel.name, content);
            }).catch(console.error);
        }
    }
};
