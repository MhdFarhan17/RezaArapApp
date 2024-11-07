function convertToFancyFonts(text) {
    const styles = [
        { name: 'Bold Serif', map: char => String.fromCodePoint(char.charCodeAt(0) + 0x1D400 - 0x41) },
        { name: 'Italic Serif', map: char => String.fromCodePoint(char.charCodeAt(0) + 0x1D434 - 0x41) },
        { name: 'Bold Script', map: char => String.fromCodePoint(char.charCodeAt(0) + 0x1D4D0 - 0x41) },
        { name: 'Fraktur', map: char => String.fromCodePoint(char.charCodeAt(0) + 0x1D504 - 0x41) },
        { name: 'Double-Struck', map: char => String.fromCodePoint(char.charCodeAt(0) + 0x1D538 - 0x41) }
    ];

    return styles.map(style => {
        const formattedText = text.split('').map(char => {
            if (/[A-Z]/.test(char)) {
                return style.map(char);
            } else if (/[a-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (style.map('A').codePointAt(0) - 'A'.codePointAt(0)) + 0x20);
            }
            return char;
        }).join('');
        return formattedText;
    });
}

module.exports = { convertToFancyFonts };
