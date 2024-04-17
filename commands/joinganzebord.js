const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs/promises');

async function readGameData() {
    const data = await fs.readFile('./game.json', 'utf8');
    return JSON.parse(data);
  }
  
  async function writeGameData(gameData) {
    const data = JSON.stringify(gameData);
    await fs.writeFile('./game.json', data, 'utf8');
  }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joinganzenbord')
        .setDescription('Join the board game')
        .addStringOption(option => 
            option.setName('team')
                .setDescription('The name of your team')
                .setRequired(false)),
  
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const userId = interaction.user.id;
            const username = interaction.user.username;
            const teamName = interaction.options.getString('team') || username; // Use team name if provided, else username
            const gameData = await readGameData();

            if (gameData.status !== 'waiting') {
                await interaction.editReply('The game is currently not accepting new players.');
                return;
            }

            gameData.players[userId] = {
                name: teamName,
                position: 0,
                status: 'waiting'
            };

            await writeGameData(gameData);
            await interaction.editReply(`${teamName} has joined the game!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while trying to join the game.');
        }
    },
};
