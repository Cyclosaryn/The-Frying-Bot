const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const moment = require('moment-timezone');


const QUOTES_FILE_PATH = './quotes.json';
const RESET_HOUR = 9; // 9:00am in local timezone

function getQuote() {
  const quotes = JSON.parse(fs.readFileSync(QUOTES_FILE_PATH));
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function getNextResetTime() {
  const now = moment.tz('Europe/Amsterdam');
  const nextReset = now.clone().hour(RESET_HOUR).minute(0).second(0);
  if (now.hour() >= RESET_HOUR) {
    nextReset.add(1, 'day');
  }
  return nextReset.toDate();
}

let nextQuoteReset = getNextResetTime();
let currentQuote = getQuote();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Weergeeft het citaat van de dag.'),
  async execute(interaction) {
    const now = moment.tz('Europe/Amsterdam');
    if (now >= moment(nextQuoteReset)) {
      nextQuoteReset = getNextResetTime();
      currentQuote = getQuote();
    }
    const author = currentQuote.author;
    const quote = currentQuote.quote;
    let message = `"${quote}" - door <@${author.id}>`;
    if (currentQuote.date) {
        const isoDate = moment(currentQuote.date, 'DD-MM-YYYY').toISOString();
        const date = moment(isoDate).format('DD/MM/\'YY');
        message += ` op ${date}`;
    }
    await interaction.reply(message);
  },
};