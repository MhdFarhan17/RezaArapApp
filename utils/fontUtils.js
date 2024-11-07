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

        // Gaya 4: Fraktur
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D51E - 'a'.charCodeAt(0) : 0x1D504 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 5: Bold Fraktur
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D586 - 'a'.charCodeAt(0) : 0x1D56C - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 6: Double-Struck
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D552 - 'a'.charCodeAt(0) : 0x1D538 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 7: Monospace
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + 0xFF00 - 0x20);
            }
            return char;
        }).join(''),

        // Gaya 8: Small Caps
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char) && char >= 'a') {
                return String.fromCodePoint(char.charCodeAt(0) - 0x20 + 0x1D00);
            }
            return char;
        }).join(''),

        // Gaya 9: Bold Sans Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D5EE - 'a'.charCodeAt(0) : 0x1D5D4 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 10: Italic Sans Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D622 - 'a'.charCodeAt(0) : 0x1D608 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 11: Bold Italic Sans Serif
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D656 - 'a'.charCodeAt(0) : 0x1D63C - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 12: Script
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D4B6 - 'a'.charCodeAt(0) : 0x1D4AE - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 13: Bold Script
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D4EA - 'a'.charCodeAt(0) : 0x1D4D0 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 14: Blackletter
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D51E - 'a'.charCodeAt(0) : 0x1D504 - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 15: Bubble
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                const offset = char >= 'a' ? 0x24D0 - 'a'.charCodeAt(0) : 0x24B6 - 'A'.charCodeAt(0);
                return String.fromCodePoint(char.charCodeAt(0) + offset);
            }
            return char;
        }).join(''),

        // Gaya 16: Bold Bubble
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                const offset = char >= 'a' ? 0x1F150 - 'a'.charCodeAt(0) : 0x1F130 - 'A'.charCodeAt(0);
                return String.fromCodePoint(char.charCodeAt(0) + offset);
            }
            return char;
        }).join(''),

        // Gaya 17: Cursive
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                return String.fromCodePoint(char.charCodeAt(0) + (char >= 'a' ? 0x1D4B6 - 'a'.charCodeAt(0) : 0x1D4AE - 'A'.charCodeAt(0)));
            }
            return char;
        }).join(''),

        // Gaya 18: Underline (dengan diakritik)
        text.split('').map(char => `${char}\u0332`).join(''),

        // Gaya 19: Strikethrough (dengan diakritik)
        text.split('').map(char => `${char}\u0336`).join(''),

        // Gaya 20: Double Underline (dengan diakritik)
        text.split('').map(char => `${char}\u0333`).join(''),

        // Gaya 21: Superscript
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char)) {
                const superscriptMap = {
                    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ',
                    'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ',
                    'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ',
                    'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ', 'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ',
                    'E': 'ᴱ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ',
                    'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'R': 'ᴿ', 'T': 'ᵀ', 'U': 'ᵁ',
                    'V': 'ⱽ', 'W': 'ᵂ'
                };
                return superscriptMap[char] || char;
            }
            return char;
        }).join(''),

                // Gaya 22: Small Caps
        text.split('').map(char => {
            if (/[A-Za-z]/.test(char) && char >= 'a') {
                return String.fromCodePoint(char.charCodeAt(0) - 0x20 + 0x1D00);
            }
            return char;
        }).join(''),

        // Gaya 23: Inverted (Upside Down)
        text.split('').reverse().map(char => {
            const invertedMap = {
                'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ',
                'h': 'ɥ', 'i': 'ı', 'j': 'ɾ', 'k': 'ʞ', 'l': 'ן', 'm': 'ɯ', 'n': 'u',
                'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n',
                'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
                'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': '◖', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁',
                'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '⅂', 'M': 'W', 'N': 'N',
                'O': 'O', 'P': 'Ԁ', 'Q': 'Ò', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩',
                'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
                '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
                '8': '8', '9': '6', '0': '0'
            };
            return invertedMap[char] || char;
        }).join(''),

        // Gaya 24: Wide Text
        text.split('').map(char => char + '\u2002').join(''),

        // Gaya 25: Parenthesized
        text.split('').map(char => {
            const parenthesizedMap = {
                'a': '⒜', 'b': '⒝', 'c': '⒞', 'd': '⒟', 'e': '⒠', 'f': '⒡', 'g': '⒢',
                'h': '⒣', 'i': '⒤', 'j': '⒥', 'k': '⒦', 'l': '⒧', 'm': '⒨', 'n': '⒩',
                'o': '⒪', 'p': '⒫', 'q': '⒬', 'r': '⒭', 's': '⒮', 't': '⒯', 'u': '⒰',
                'v': '⒱', 'w': '⒲', 'x': '⒳', 'y': '⒴', 'z': '⒵',
                'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ',
                'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ',
                'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ',
                'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ'
            };
            return parenthesizedMap[char] || char;
        }).join(''),

        // Gaya 26: Fancy Stars
        text.split('').map(char => `★${char}★`).join(''),

        // Gaya 27: Wavy Text (dengan diakritik)
        text.split('').map((char, index) => {
            const diacritics = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305'];
            return char + diacritics[index % diacritics.length];
        }).join(''),

        // Gaya 28: Hollow Text
        text.split('').map(char => {
            const hollowMap = {
                'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘',
                'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟',
                'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦',
                'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
                'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾',
                'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ',
                'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌',
                'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ'
            };
            return hollowMap[char] || char;
        }).join(''),

        // Gaya 29: Fancy Dots
        text.split('').map(char => `${char}\u2022`).join(''),

        // Gaya 30: Zigzag Text (dengan diakritik)
        text.split('').map((char, index) => {
            const diacritics = ['\u0310', '\u0311', '\u0308', '\u0307'];
            return char + diacritics[index % diacritics.length];
        }).join('')
    ];

    return fancyFonts;
}

module.exports = { convertToFancyFonts };
