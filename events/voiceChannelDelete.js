// events/voiceChannelDelete.js
const constants = require('../utils/constants');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    // Mengecek apakah pengguna meninggalkan voice channel
    const channel = oldState.channel;

    // Dapatkan konfigurasi server yang sesuai berdasarkan guildId
    const serverConfig = Object.values(constants).find(config => config.guildId === oldState.guild.id);
    if (!serverConfig) return;

    if (channel && channel.members.size === 0 && channel.parentId === serverConfig.tempVoiceCategoryId) {
      // Hapus channel setelah 10 detik kosong
      setTimeout(() => {
        if (channel.members.size === 0) {
          channel.delete().catch(console.error);
        }
      }, 10000); // 10 detik delay
    }
  },
};
