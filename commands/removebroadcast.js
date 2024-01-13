const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removebroadcast')
    .setDescription('Verwijdert een geplande uitzending')
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('Het indexnummer van de geplande uitzending om te verwijderen (1-based)')
        .setRequired(true)),
  async execute(interaction) {
    const indexToRemove = interaction.options.getInteger('index');

    // read the scheduled broadcasts from the JSON file
    const broadcastJSON = fs.readFileSync('./planned.json', 'utf8');
    const scheduledBroadcasts = JSON.parse(broadcastJSON);

    // convert 1-based index to 0-based index
    const adjustedIndex = indexToRemove - 1;

    // check if the index is valid
    if (adjustedIndex < 0 || adjustedIndex >= scheduledBroadcasts.length) {
      return await interaction.reply('Ongeldige index. Geef een geldig indexnummer op.');
    }

    // remove the scheduled broadcast at the specified index
    const removedBroadcast = scheduledBroadcasts.splice(adjustedIndex, 1)[0];

    // write the updated scheduled broadcasts back to the file
    fs.writeFileSync('./planned.json', JSON.stringify(scheduledBroadcasts));

    // reply with a confirmation message
    const confirmationMessage = `De geplande uitzending "${removedBroadcast.message}" in ${interaction.client.channels.cache.get(removedBroadcast.channel)} op ${removedBroadcast.date} om ${removedBroadcast.time} is verwijderd.`;
    await interaction.reply(confirmationMessage);
  },
};
