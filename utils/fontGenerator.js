const { convertToFancyFonts } = require('./fontUtils');
const { server1 } = require('./constants'); // Import server1 untuk mengambil fontGeneratorId

module.exports = {
    handleFontRequest(client, message) {
        // Pastikan hanya merespons di channel khusus
        if (message.channel.id !== server1.fontGeneratorId) return;

        const PREFIX = 'font!';
        if (message.content.startsWith(PREFIX)) {
            const text = message.content.slice(PREFIX.length).trim();
            if (!text) {
                return message.channel.send('Ketikkan teks setelah perintah untuk mengubah font, contohnya `font! Farhan`.');
            }

            const fancyFonts = convertToFancyFonts(text);

            // Kirimkan hasil konversi ke channel
            let response = `Berikut adalah beberapa pilihan gaya font untuk "${text}":\n`;
            fancyFonts.forEach((font, index) => {
                response += `\`${index + 1}\`. ${font}\n`;
            });

            message.channel.send(response);
        }
    }
};
