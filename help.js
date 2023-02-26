const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Laat een lijst zien met alle beschikbare commando\'s.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
            .setColor(0x0099FF)
			.setTitle('Lijst van commando\'s')
            .setAuthor({ name: 'Cyclosarin', iconURL: 'https://i.ibb.co/mCJFKrH/Discord-Picture.jpg', url: 'https://discord.com/users/269195416963121152' })
			.setDescription('Hieronder vind je een lijst met alle beschikbare commando\'s.')
			.addFields(
                { name: '/broadcast', value: 'Stuurt een bericht naar een kanaal op een specifieke datum en tijd.' },
			    { name: '/loten', value: 'Kiest een willekeurig persoon uit een lijst van genoemde personen.' },
			    { name: '/quote', value: 'Geeft het citaat van de dag.'},
			    { name: '/addquote', value: 'Voegt een citaat toe aan de lijst van citaten.'},
            )
            .setTimestamp()
			.setFooter({ text: '© The Frying Bot by Cyclosarin', iconURL: 'https://i.ibb.co/mCJFKrH/Discord-Picture.jpg' });

		await interaction.reply({ embeds: [embed] });
	},
};
