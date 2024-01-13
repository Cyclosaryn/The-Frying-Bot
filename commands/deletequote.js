const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removequote')
    .setDescription('Verwijdert een citaat uit de quotes lijst')
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('Het indexnummer van het citaat om te verwijderen')
        .setRequired(true)),
  async execute(interaction) {
    const indexToRemove = interaction.options.getInteger('index');

    // read the quotes from the JSON file
    const data = fs.readFileSync('./quotes.json', 'utf8');
    const quotes = JSON.parse(data);

    // check if the index is valid
    if (indexToRemove < 0 || indexToRemove >= quotes.length) {
      return await interaction.reply('Ongeldige index. Geef een geldig indexnummer op.');
    }

    // remove the quote at the specified index
    const removedQuote = quotes.splice(indexToRemove, 1)[0];

    // write the updated quotes back to the file
    fs.writeFileSync('./quotes.json', JSON.stringify(quotes));

    // reply with a confirmation message
    const confirmationMessage = `Het citaat "${removedQuote.quote}" door ${removedQuote.author.tag} is verwijderd uit de lijst.`;
    await interaction.reply(confirmationMessage);
  },
};
