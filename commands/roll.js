const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rol een dobbelsteen om te bewegen over het ganzebord.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const gameData = JSON.parse(fs.readFileSync('./game.json', 'utf8'));

    if (gameData.status !== 'active' || !(userId in gameData.players)) {
      await interaction.reply('Het spel is niet actief of je bent niet in het spel. Gebruik `/startganzenbord` om het spel te starten.');
      return;
    }

    const playerName = gameData.players[userId].name; // This could be a team name or username

    if (gameData.currentTurn !== userId) {
      await interaction.reply(`Het is op dit moment ${playerName}'s beurt, wacht tot het je beurt is om te rollen.`);
      return;
    }

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    let newPosition = gameData.players[userId].position + diceRoll;

    if (newPosition >= gameData.board.length) {
      newPosition = gameData.board.length - 1;
      gameData.players[userId].position = newPosition;
      gameData.status = 'finished';
      fs.writeFileSync('./game.json', JSON.stringify(gameData), 'utf8');
      await interaction.reply(`Gefeliciteerd, ${playerName} Heeft het spel gewonnen!`);
      return;
    }

    gameData.players[userId].position = newPosition;
    let message = `${playerName} rolde een ${diceRoll} en beweegt naar ${newPosition + 1}.`;

    const currentSquare = gameData.board[newPosition];
    if (currentSquare.move !== 0) {
      newPosition += currentSquare.move;
      newPosition = Math.max(0, Math.min(newPosition, gameData.board.length - 1));
      gameData.players[userId].position = newPosition;
      message += ` ${currentSquare.mission}, ${playerName} staat op positie ${newPosition + 1}.`;
    }

    const playerIds = Object.keys(gameData.players);
    const currentPlayerIndex = playerIds.indexOf(userId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;
    gameData.currentTurn = playerIds[nextPlayerIndex];
    fs.writeFileSync('./game.json', JSON.stringify(gameData), 'utf8');

    message += `\nHet is nu <@${gameData.currentTurn}>'s beurt!`;
    await interaction.reply(message);
  },
};
