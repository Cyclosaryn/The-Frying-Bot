const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listbroadcast')
    .setDescription('Lijst alle geplande uitzendingen op'),
  async execute(interaction) {
    // read the scheduled broadcasts from the JSON file
    const broadcastJSON = fs.readFileSync('./planned.json', 'utf8');
    const scheduledBroadcasts = JSON.parse(broadcastJSON);

    // construct a message with scheduled broadcasts
    let listMessage = 'Lijst van geplande uitzendingen:\n';
    scheduledBroadcasts.forEach((broadcast, index) => {
      listMessage += `${index + 1}. "${broadcast.message}" in ${interaction.client.channels.cache.get(broadcast.channel)} op ${broadcast.date} om ${broadcast.time}\n`;
    });

    // reply with the list message
    await interaction.reply(listMessage);
  },
};
