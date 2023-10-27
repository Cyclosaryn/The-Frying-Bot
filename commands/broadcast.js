const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { Role } = require('discord.js');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const fs = require('fs');

const SCHEDULED_MESSAGES_FILE = 'planned.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('Send a message to a specified channel at a specified date and time.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send.')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send the message to.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('date')
        .setDescription('The date to send the message on (DD-MM-YYYY).')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('time')
        .setDescription('The time to send the message at (HH:MM).')
        .setRequired(true))
    .addMentionableOption(option =>
      option.setName('mention')
        .setDescription('A role or member to mention in the message.')), // allow a role or member mention
  async execute(interaction) {
    console.log('Broadcast function called');
    const message = interaction.options.getString('message'); // get the value of the message option
    const channel = interaction.options.getChannel('channel', true); // get a required channel option without checking if it exists
    const date = interaction.options.getString('date'); // get the value of the date option
    const time = interaction.options.getString('time'); // get the value of the time option
    const mention = interaction.options.getMentionable('mention'); // get the value of the target option

    const [day, month, year] = date.split('-').map(Number); // split and parse the date components
    const [hour, minute] = time.split(':').map(Number); // split and parse the time components

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) { // check if any component is invalid
      await interaction.deferReply(); // defer reply instead of sending an ephemeral message
      return; // exit early
    }

    const broadcastDate = moment.tz(`${year}-${month}-${day} ${hour}:${minute}:00`, 'YYYY-MM-DD HH:mm:ss', 'Europe/Amsterdam');
    broadcastDate.tz('Europe/Amsterdam');

    if (broadcastDate < Date.now()) { // check if the broadcast date is in the past
      await interaction.deferReply(); // defer reply instead of sending an ephemeral message
      return; // exit early
    }

    const confirmationMessage = `Je bericht wordt verzonden op ${day}/${month}/${year} om ${hour}:${minute} in ${channel}.`;

    let messageToSend = message;
    let mentionToSend = '';

    if (mention) {
      const target = mention instanceof Role ? `@role ${mention.name}` : mention.toString();
      mentionToSend = `${target}`;
    }

    const scheduledFunction = schedule.scheduleJob(broadcastDate.toDate(), async function () {
      const embed = new EmbedBuilder()
        .setTitle("Broadcast:")
        .setDescription(message)
        .setColor('#0099ff')
        .setTimestamp(broadcastDate.toDate());

      await channel.send({ embeds: [embed] });

      if (mentionToSend) {
        await channel.send(`Hey, ${mention} dit bericht hier boven is bedoeld voor jou!`);
      }

      // Remove the broadcast message from the JSON file
      const broadcastJSON = fs.readFileSync(SCHEDULED_MESSAGES_FILE);
      const scheduledMessages = JSON.parse(broadcastJSON);
      const messageIndex = scheduledMessages.findIndex(m => m.channel === channel.id && m.date === date && m.time === time && m.message === message && m.mention === (mention ? mention.id : null));
      if (messageIndex >= 0) {
        scheduledMessages.splice(messageIndex, 1);
        fs.writeFileSync(SCHEDULED_MESSAGES_FILE, JSON.stringify(scheduledMessages));
      }

    });

    // Reply with confirmation message
    await interaction.reply(`Je bericht wordt verzonden op ${broadcastDate.format('DD-MM-YYYY HH:mm:ss')} in ${channel}.`);

    // Store the broadcast message in the JSON file
    const broadcastData = {
      message,
      channel: channel.id,
      date: date,
      time: time,
      mention: mention ? mention.id : null
    };
    const broadcastJSON = fs.readFileSync(SCHEDULED_MESSAGES_FILE);
    let scheduledMessages = JSON.parse(broadcastJSON);
    scheduledMessages.push(broadcastData);
    fs.writeFileSync(SCHEDULED_MESSAGES_FILE, JSON.stringify(scheduledMessages));
  }
};
