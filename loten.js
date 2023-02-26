const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loten')
		.setDescription('Kiest een random member uit.')
        .addStringOption(option => 
            option.setName('users')
            .setDescription('Lijst van members die mee doen met de loting')
            .setRequired(true)), // add a string option
	async execute(interaction) {
        const users = interaction.options.getString('users'); // get the value of the option
        const mentions = users.match(/<@!?(\d+)>/g); // extract mentions from the string
        if (mentions && mentions.length > 0) { // check if there are any mentions
            const randomUser = mentions[Math.floor(Math.random() * mentions.length)]; // pick a random user from the array
            await interaction.reply(`Gefeliciteerd! ${randomUser}! je bent uitgeloot!:partying_face: :confetti_ball:`); // reply with the random user
        } else {
            await interaction.reply('Specificeer tenminste 1 member.'); // reply with an error message
        }
	},
};