function convertToFancyFonts(text) {
    const fancyFonts = [
        text.split('').map(char => `𝐅${char}`).join(''), // Gaya 1
        text.split('').map(char => `𝑭${char}`).join(''), // Gaya 2
        text.split('').map(char => `𝓕${char}`).join(''), // Gaya 3
        text.split('').map(char => `𝗙${char}`).join(''), // Gaya 4
        text.split('').map(char => `𝔉${char}`).join(''), // Gaya 5
    ];
    return fancyFonts;
}

module.exports = { convertToFancyFonts };
