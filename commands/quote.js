const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const moment = require('moment-timezone');

const QUOTES_FILE_PATH = './quotes.json';
const RESET_HOUR = 9; // 9:00am in local timezone

let usedQuotes = [];
let nextQuoteReset = getNextResetTime();
let lastQuoteDisplayed = null;

function getQuote() {
  const quotes = JSON.parse(fs.readFileSync(QUOTES_FILE_PATH));
  const availableQuotes = quotes.filter(q => !usedQuotes.includes(q.id));
  if (availableQuotes.length === 0) {
    // All quotes have been used, return the last quote displayed
    return lastQuoteDisplayed;
  }
  let currentQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  usedQuotes.push(currentQuote.id);
  lastQuoteDisplayed = currentQuote;
  return currentQuote;
}

function getNextResetTime() {
  const now = moment.tz('Europe/Amsterdam');
  const nextReset = now.clone().hour(RESET_HOUR).minute(0).second(0);
  if (now.hour() >= RESET_HOUR) {
    nextReset.add(1, 'day');
  }
  return nextReset.toDate();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Weergeeft het citaat van de dag.'),
    async execute(interaction) {
    const now = moment.tz('Europe/Amsterdam');
    if (now >= moment(nextQuoteReset)) {
      // It's a new day, reset the used quotes
      usedQuotes = [];
      nextQuoteReset = getNextResetTime();
      lastQuoteDisplayed = null;
    }
    let currentQuote = getQuote();
    if (!currentQuote) {
      // No available quotes found, handle the error
      return await interaction.reply('Er zijn geen beschikbare citaten op dit moment.');
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
