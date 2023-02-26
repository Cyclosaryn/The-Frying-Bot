const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); // import MessageEmbed from discord.js
const schedule = require('node-schedule');
const moment = require('moment-timezone');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('broadcast')
		.setDescription('Verzend een bericht op een vooraf gespecificeerde tijd en datum in een gespecificeerd kanaal,')
        .addStringOption(option => 
            option.setName('message')
            .setDescription('Het bericht om te versturen:')
            .setRequired(true)) // add a string option for the message
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('Het kanaal om het bericht in te versturen:')
            .setRequired(true)) // add a channel option for the channel
        .addStringOption(option => 
            option.setName('date')
            .setDescription('De datum voor het versturen van het bericht (DD-MM-YYYY)')
            .setRequired(true)) // add a string option for the date
        .addStringOption(option => 
            option.setName('time')
            .setDescription('De tijd voor het versturen van het bericht (HH:MM)')
            .setRequired(true)), // add a string option for the time
	async execute(interaction) {
        const message = interaction.options.getString('message'); // get the value of the message option
        const channel = interaction.options.getChannel('channel', true); // get a required channel option without checking if it exists
        const date = interaction.options.getString('date'); // get the value of the date option
        const time = interaction.options.getString('time'); // get the value of the time option

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

        await interaction.reply(`Je bericht wordt verzonden op ${day}/${month}/${year} om ${hour}:${minute} in ${channel}.`); // reply with a confirmation message
        
      const embed = new EmbedBuilder()  // use new MessageEmbed() instead of new Discord.MessageEmbed()
          .setTitle(message)

        schedule.scheduleJob(broadcastDate.toDate(), () => { // use {date: broadcastDate} instead of broadcastDate as an argument
          channel.send({embeds: [embed]}); // use embeds property instead of embed property to send embeds
      });
	},
};