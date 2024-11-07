function convertToFancyFonts(text) {
    const fancyFonts = [
        // Gaya 1: Bold Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D41A - 'a'.charCodeAt(0) : 0x1D400 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 2: Italic Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D44E - 'a'.charCodeAt(0) : 0x1D434 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 3: Bold Italic Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D482 - 'a'.charCodeAt(0) : 0x1D468 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 4: Script (umumnya didukung)
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D4B6 - 'a'.charCodeAt(0) : 0x1D4AE - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 5: Sans Serif Italic (umumnya didukung)
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D622 - 'a'.charCodeAt(0) : 0x1D608 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 6: Monospace
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + 0xFF00 - 0x20);
            }
            return char;
        }).join(''),

        // Gaya 7: Small Caps
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char) && char >= 'a') {
                return String.fromCodePoint(char.charCodeAt(0) - 0x20 + 0x1D00);
            }
            return char;
        }).join(''),

        // Gaya 8: Bold Sans Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D5EE - 'a'.charCodeAt(0) : 0x1D5D4 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 9: Italic Sans Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D622 - 'a'.charCodeAt(0) : 0x1D608 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 10: Bold Italic Sans Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D656 - 'a'.charCodeAt(0) : 0x1D63C - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),
    ];

    return fancyFonts;
}

module.exports = { convertToFancyFonts };
