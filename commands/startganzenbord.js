const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startganzenbord')
    .setDescription('Starts the Ganzenbord game'),

  async execute(interaction) {
    const gameData = JSON.parse(await fs.readFile('./game.json', 'utf8'));

    if (gameData.status === 'active') {
      await interaction.reply('The game is already in progress!');
      return;
    }
    if (Object.keys(gameData.players).length < 1) {
      await interaction.reply('Not enough players to start the game. At least 2 players are required.');
      return;
    }

    gameData.status = 'active';
    const playerIds = Object.keys(gameData.players);
    gameData.currentTurn = playerIds[Math.floor(Math.random() * playerIds.length)];

    await fs.writeFile('./game.json', JSON.stringify(gameData), 'utf8');

    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle('Ganzenbord Game Started!')
      .setDescription(`The game has started! It's <@${gameData.currentTurn}>'s turn to roll the dice.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
