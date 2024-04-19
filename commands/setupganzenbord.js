const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs/promises'); // Use the promises version for async operations
const xlsx = require('xlsx');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed for fetching files

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupganzenbord')
    .setDescription('Setup een nieuw ganzenbord spel vanuit een Excel bestand')
    .addAttachmentOption(option =>
      option.setName('board')
      .setDescription('Upload een Excel bestand met het spelbord configuratie')
      .setRequired(true)),
  
  async execute(interaction) {
    try {
      const file = interaction.options.getAttachment('board');
      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse the Excel file
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(worksheet);

      // Validate required columns
      if (!json.every(row => 'Square' in row && 'Mission' in row && 'Move' in row)) {
        await interaction.reply('Het excel bestand moet de kolommen "Square", "Mission" en "Move" bevatten. Probeer het opnieuw.');
        return;
      }

      // Transform JSON to match your game structure
      const board = json.map(row => ({
        square: row.Square,
        mission: row.Mission,
        move: row.Move
      }));

      // Initialize game structure
      const gameData = {
        board: board,
        players: {},
        status: 'waiting', // 'active', 'finished'
        currentTurn: null // Initialize turn control
      };

      // Write to a game configuration file
      await fs.writeFile('./game.json', JSON.stringify(gameData), 'utf8');

      await interaction.reply('Het spelbord is succesvol ingesteld! Gebruik `/joinganzenbord` om mee te doen.');
    } catch (error) {
      console.error(error);
      await interaction.reply('Er is een fout opgetreden bij het instellen van het spelbord. Probeer het opnieuw.');
    }
  },
};
