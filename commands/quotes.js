const quotes = [
    "Cinta tanpa komitmen itu seperti game tanpa tujuan, hanya berjalan tanpa arah.",
    "Kamu adalah bonus level dalam hidupku, tempat di mana aku menemukan kebahagiaan lebih.",
    "Saya bukan pemalas, saya cuma sangat termotivasi untuk tidak melakukan apa pun.",
    "Saya tidak telat, saya cuma tiba tepat ketika saya merasa perlu.",
    "Pekerjaan rumah tangga tidak akan membunuhmu, tapi kenapa mengambil risiko?",
    "Kenapa aku harus berlari kalau bisa duduk? Dan kenapa duduk kalau bisa tiduran?",
    "Aku tidak malas. Aku sedang dalam mode hemat energi.",
    "Hati yang hancur adalah bagian dari kehidupan yang mengajarkan kita bagaimana menghargai kebahagiaan yang sesungguhnya.",
    "Kadang, yang terberat bukanlah perpisahan, tetapi kenyataan bahwa kamu sudah tidak memperjuangkan lagi.",
    "Rasa sakit hati membuat kita mengerti arti dari ketulusan yang sebenarnya.",
    "Aku pernah berharap, tapi kini aku belajar melepaskan agar bisa bertahan.",
    "Tak ada yang lebih menyakitkan selain mencintai seseorang yang sudah tak lagi peduli.",
    "Saat kau tersenyum dengan yang lain, aku belajar tersenyum meski hatiku menangis.",
    "Menghilangkanmu dari pikiran ternyata lebih sulit daripada yang aku bayangkan.",
    "Kadang kita harus menerima bahwa beberapa orang hanya ada dalam cerita, bukan dalam kenyataan kita.",
    "Cinta yang pergi meninggalkan luka, tetapi luka itu pula yang mengajarkan kita untuk lebih kuat.",
    "Aku rindu, tapi rindu ini tak pantas lagi ditujukan padamu.",
    "Kamu adalah alasan aku percaya cinta, dan juga alasan aku takut mencintai lagi.",
    "Berusaha melupakanmu seperti berusaha menghapus kenangan indah yang tak pernah mau hilang.",
    "Mungkin waktu akan menyembuhkan, tapi saat ini aku hanya ingin merasakan sakitnya agar aku tahu bagaimana harus bertahan.",
    "Hati ini tidak bisa dipaksakan untuk sembuh, apalagi jika masih ada bekas yang begitu dalam.",
    "Aku belajar bahwa beberapa kepergian memang lebih baik untuk kebaikan kita sendiri.",
    "Sulit mencintai lagi ketika hati masih dipenuhi kenangan tentangmu.",
    "Kehilanganmu bukan akhir dunia, tapi adalah awal perjalanan untuk menemukan siapa diriku sebenarnya.",
    "Aku tidak marah karena kau pergi, aku hanya kecewa karena pernah berharap kita akan selalu bersama.",
    "Aku memilih diam, karena kadang kata-kata tidak cukup untuk menjelaskan betapa hati ini terluka.",
    "Yang menyakitkan bukanlah perpisahan, tapi janji-janji yang ternyata tak bisa ditepati.",
    "Kesuksesan bukan soal seberapa cepat kamu sampai, tetapi seberapa kuat kamu bertahan dalam perjalanan.",
    "Jangan takut gagal, karena kegagalan adalah langkah penting menuju kesuksesan.",
    "Setiap mimpi besar dimulai dari satu langkah kecil yang penuh keberanian.",
    "Kerja keras mungkin melelahkan, tapi hasil yang kamu dapat akan selalu sepadan dengan usaha yang kamu berikan.",
    "Sukses tidak datang dari zona nyaman, tapi dari keberanian melangkah keluar dan mengambil risiko.",
    "Peluang besar sering kali tersembunyi di balik kesulitan. Jangan menyerah, tetaplah berjuang.",
    "Hidup ini terlalu singkat untuk menunggu kesempatan datang, ciptakan kesempatan itu sendiri.",
    "Jangan fokus pada apa yang kamu tidak punya, tapi maksimalkan apa yang kamu miliki untuk mencapai tujuan.",
    "Jangan biarkan rasa takut menghalangi impianmu. Ingat, orang sukses adalah mereka yang berani menghadapi ketakutan.",
    "Bekerja untuk tujuan yang kamu cintai akan membuatmu tidak merasa bekerja seumur hidup.",
    "Setiap hari adalah kesempatan baru untuk belajar, tumbuh, dan menjadi lebih baik daripada dirimu kemarin.",
    "Jangan bandingkan dirimu dengan orang lain. Fokuslah pada perjalananmu dan hargai setiap kemajuan kecil.",
    "Kesuksesan sejati adalah ketika kamu mampu bangkit setiap kali terjatuh dan tidak pernah kehilangan semangat untuk mencoba lagi."
];

module.exports = {
    handleQuotes(message) {
        const content = message.content.toLowerCase();

        if (content === "quotes!") {
            if (quotes.length === 0) {
                message.channel.send("Maaf, tidak ada quotes yang tersedia saat ini.")
                    .catch(console.error);
            } else {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                message.channel.send(randomQuote)
                    .then(() => {
                        console.log('Random quote berhasil dikirim!');
                    })
                    .catch(console.error);
            }
        }
    }
};
