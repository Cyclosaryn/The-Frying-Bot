const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a dice and move on the board'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const gameData = JSON.parse(fs.readFileSync('./game.json', 'utf8'));

    if (gameData.status !== 'active' || !(userId in gameData.players)) {
      await interaction.reply('The game is not active or you have not joined yet.');
      return;
    }

    const playerName = gameData.players[userId].name; // This could be a team name or username

    if (gameData.currentTurn !== userId) {
      await interaction.reply(`It's not your turn yet. It's currently ${playerName}'s turn.`);
      return;
    }

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    let newPosition = gameData.players[userId].position + diceRoll;

    if (newPosition >= gameData.board.length) {
      newPosition = gameData.board.length - 1;
      gameData.players[userId].position = newPosition;
      gameData.status = 'finished';
      fs.writeFileSync('./game.json', JSON.stringify(gameData), 'utf8');
      await interaction.reply(`Congratulations, ${playerName} has reached the end and won the game!`);
      return;
    }

    gameData.players[userId].position = newPosition;
    let message = `${playerName} rolled a ${diceRoll} and moved to square ${newPosition + 1}.`;

    const currentSquare = gameData.board[newPosition];
    if (currentSquare.move !== 0) {
      newPosition += currentSquare.move;
      newPosition = Math.max(0, Math.min(newPosition, gameData.board.length - 1));
      gameData.players[userId].position = newPosition;
      message += ` ${currentSquare.mission} Now, ${playerName} is on square ${newPosition + 1}.`;
    }

    const playerIds = Object.keys(gameData.players);
    const currentPlayerIndex = playerIds.indexOf(userId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;
    gameData.currentTurn = playerIds[nextPlayerIndex];
    fs.writeFileSync('./game.json', JSON.stringify(gameData), 'utf8');

    message += `\nIt's now <@${gameData.currentTurn}>'s turn!`;
    await interaction.reply(message);
  },
};
