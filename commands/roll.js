const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rol een dobbelsteen om te bewegen over het ganzebord.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const gameData = JSON.parse(fs.readFileSync('./game.json', 'utf8'));

    // Check if the game is active and the player is part of the game
    if (gameData.status !== 'active' || !(userId in gameData.players)) {
      await interaction.reply('Het spel is niet actief of je bent niet in het spel. Gebruik `/startganzenbord` om het spel te starten.');
      return;
    }

    const playerName = gameData.players[userId].name; // This could be a team name or username

    // Roll a dice
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    let newPosition = gameData.players[userId].position + diceRoll;

    // Check if the player has reached the end of the board
    if (newPosition >= gameData.board.length) {
      newPosition = gameData.board.length - 1;
      gameData.players[userId].position = newPosition;
      gameData.status = 'finished';
      fs.writeFileSync('./game.json', JSON.stringify(gameData), 'utf8');
      await interaction.reply(`Gefeliciteerd, ${playerName} heeft het spel gewonnen!`);
      return;
    }

    // Update player position
    gameData.players[userId].position = newPosition;
    const currentSquare = gameData.board[newPosition];
    let message = `${playerName} rolde een ${diceRoll} en beweegt naar positie ${newPosition + 1}.`;

    // Announce the mission for the square
    message += ` De huidige missie op dit vakje is: "${currentSquare.mission}".`;

    // Check the landed square for any special effects (like moving forward/backward)
    if (currentSquare.move !== 0) {
      newPosition += currentSquare.move;
      newPosition = Math.max(0, Math.min(newPosition, gameData.board.length - 1));
      gameData.players[userId].position = newPosition;
      message += ` ${currentSquare.mission}, ${playerName} staat nu op positie ${newPosition + 1}.`;
    }

    // Save the updated game data
    fs.writeFileSync('./game.json', JSON.stringify(gameData), 'utf8');

    // Reply with the result of the dice roll, the player's new position, and the mission on the new square
    await interaction.reply(message);
  },
};
