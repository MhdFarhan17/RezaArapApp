function isMusicLink(content) {
    const youtubePattern = /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const spotifyPattern = /https?:\/\/(open\.spotify\.com)\/.+/;
    return youtubePattern.test(content) || spotifyPattern.test(content);
}

function isValidMusicCommand(content) {
    const validCommands = ['m!play', 'm!p', 'm!s', 'm!skip', 'm!leave', 'm!stop', 'm!resume'];
    return validCommands.some(command => content.startsWith(command));
}

function sendWarning(message, warningText, timeout = 60000) {
    message.channel.send(warningText)
        .then(sentMessage => setTimeout(() => sentMessage.delete().catch(console.error), timeout))
        .catch(console.error);
}

module.exports = {
    handleMusicRequest(client, message) {
        const content = message.content.toLowerCase();

        if (!isMusicLink(content) && !isValidMusicCommand(content)) {
            message.delete().then(() => {
                sendWarning(message, `${message.author}, di channel ini hanya diperbolehkan mengirim link YouTube, Spotify, atau menggunakan perintah musik yang valid.`);
            }).catch(console.error);
        }
    }
};
