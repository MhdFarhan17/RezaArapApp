const constants = require('../utils/constants');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    const channel = oldState.channel;

    const serverConfig = Object.values(constants).find(config => config.guildId === oldState.guild.id);
    if (!serverConfig) return;

    if (channel && channel.members.size === 0 && channel.parentId === serverConfig.tempVoiceCategoryId) {
      setTimeout(() => {
        if (channel.members.size === 0) {
          channel.delete().catch(console.error);
        }
      }, 60000);
    }
  },
};
