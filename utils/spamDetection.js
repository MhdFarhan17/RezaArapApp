module.exports = {
    checkSpam(userMessages, userId, now, timeframe = 5000, threshold = 2) {
        if (!userMessages[userId]) {
            userMessages[userId] = [];
        }
        userMessages[userId].push(now);
        userMessages[userId] = userMessages[userId].filter(timestamp => now - timestamp < timeframe);

        if (userMessages[userId].length > threshold) {
            return true;
        }
        return false;
    }
};
