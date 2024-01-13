const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listquotes')
    .setDescription('Lijst alle citaten op'),
  async execute(interaction) {
    // read the quotes from the JSON file
    const data = fs.readFileSync('./quotes.json', 'utf8');
    const quotes = JSON.parse(data);

    // construct a message with quotes and their IDs
    let listMessage = 'Lijst van citaten:\n';
    quotes.forEach((quote, index) => {
      listMessage += `${index + 1}. "${quote.quote}" door ${quote.author.tag}\n`;
    });

    // reply with the list message
    await interaction.reply(listMessage);
  },
};
