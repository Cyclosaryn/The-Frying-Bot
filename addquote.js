const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addquote')
    .setDescription('Voegt een citaat toe aan de quotes lijst')
    .addStringOption(option => 
      option.setName('quote')
      .setDescription('Het citaat om toe te voegen')
      .setRequired(true))
    .addUserOption(option =>
      option.setName('author')
      .setDescription('De originele schrijver')
      .setRequired(true)) // add a user option for the author
    .addStringOption(option =>
      option.setName('date')
      .setDescription('De originele datum in het formaat: dd-mm-yyyy')
      .setRequired(false)), // add an optional string option for the date
  async execute(interaction) {
    const quote = interaction.options.getString('quote'); // get the value of the quote option
    const author = interaction.options.getUser('author'); // get the value of the author option
    const date = interaction.options.getString('date'); // get the value of the date option

    // read the quotes from the JSON file
    const data = fs.readFileSync('quotes.json', 'utf8');
    const quotes = JSON.parse(data);

    // create a new quote object
    const newQuote = { quote, author };
    if (date) {
      newQuote.date = date;
    }

    // add the new quote to the list
    quotes.push(newQuote);

    // write the updated quotes back to the file
    fs.writeFileSync('quotes.json', JSON.stringify(quotes));

    // reply with a confirmation message
    let confirmationMessage = `Het citaat "${quote}" door ${author.tag}`;
    if (date) {
      confirmationMessage += ` op ${date}`;
    }
    confirmationMessage += ' is toegevoegd aan de lijst!';
    await interaction.reply(confirmationMessage);
  },
};
