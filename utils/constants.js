module.exports = {
    // Konfigurasi untuk Server 1
    server1: {
        guildId: '1222531463807762462',
        leaderboardChannelId: '1294689978210582548',
        allowedChannelIds: ['1222548256727240714'],
        linkOnlyChannelIds: ['1222535529934098442'],  // Ubah ke array agar konsisten dengan allowedChannelIds
        musicRequestChannelIds: ['1248149862185177108'],  // Ubah ke array
        moderationLogChannelId: '1294689208635752541',  // Pastikan ini adalah string
        antiRaidRoleId: ['1290267440164634665'],
        tempVoiceCategoryId: '1291854096646541364',
        commandChannelId: '1291829623423762474'
    },
    // Konfigurasi untuk Server 2
    server2: {
        guildId: '1288595563130126346',
        allowedChannelIds: ['1288595563914465325', '1290003287659249705'],
        linkOnlyChannelIds: ['1288615004714565652'],  // Ubah ke array
        musicRequestChannelIds: ['1288615465324642324'],  // Ubah ke array
        moderationLogChannelId: '1290061841543991296',  // Pastikan ini adalah string
        antiRaidRoleId: ['1288601588327387146'],
        tempVoiceCategoryId: '1291484735763251241',
        commandChannelId: '1291481116716433462'
    },
    youtubeRegex: /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
    spotifyRegex: /https?:\/\/(open\.spotify\.com)\/.+/,
    tiktokRegex: /https?:\/\/(www\.)?tiktok\.com\/.+/,
    twitchRegex: /https?:\/\/(www\.)?(twitch\.tv)\/.+/,
    bannedWords: ['kontol', 'memek', 'judi', 'sex', 'ngewe', 'ngentot', 'anjing', 'babi', 'tolol', 'bodoh', 'tai', 'taek', 'bajingan', 'pantat', 'jembut']
};
