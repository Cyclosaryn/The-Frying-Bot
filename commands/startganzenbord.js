const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startganzenbord')
    .setDescription('Starts het Ganzenbord spel'),

  async execute(interaction) {
    const gameData = JSON.parse(await fs.readFile('./game.json', 'utf8'));

    if (gameData.status === 'active') {
      await interaction.reply('Het spelk is al gestart. Gebruik `/roll` om te dobbelen.');
      return;
    }
    if (Object.keys(gameData.players).length < 2) {
      await interaction.reply('Niet genoeg spelers om het spel te starten. Minimum aantal spelers is 2. Gebruik `/joinganzenbord` om mee te doen.');
      return;
    }

    gameData.status = 'active';
    const playerIds = Object.keys(gameData.players);
    gameData.currentTurn = playerIds[Math.floor(Math.random() * playerIds.length)];

    await fs.writeFile('./game.json', JSON.stringify(gameData), 'utf8');

    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle('Ganzenbord Game Started!')
      .setDescription(`Het spel is gestart, het is <@${gameData.currentTurn}>'s beurt om te rollen. Gebruik \`/roll\` om te dobbelen en te bewegen over het spelbord. Veel succes en veel plezier met het spel!`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
