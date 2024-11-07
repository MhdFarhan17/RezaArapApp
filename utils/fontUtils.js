function convertToFancyFonts(text) {
    // Array untuk menyimpan gaya font Unicode
    const fancyFonts = [
        // Gaya Bold
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D41A - 'a'.charCodeAt(0) : 0x1D400 - 'A'.charCodeAt(0)));
            }
            return char; // Karakter selain huruf dibiarkan apa adanya
        }).join(''),

        // Gaya Italic
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D44E - 'a'.charCodeAt(0) : 0x1D434 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya Bold Italic
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D482 - 'a'.charCodeAt(0) : 0x1D468 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya Fraktur
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D51E - 'a'.charCodeAt(0) : 0x1D504 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya Double-Struck
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D552 - 'a'.charCodeAt(0) : 0x1D538 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),
    ];

    return fancyFonts;
}

module.exports = { convertToFancyFonts };