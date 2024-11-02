# TFD-Bot

TFD-Bot is a Discord bot designed to manage and play various games, including a board game called "Ganzenbord". It also provides functionalities for managing quotes and broadcasting messages.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Commands](#commands)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/TFD-Bot.git
    cd TFD-Bot
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Discord bot token:
    ```env
    DISCORD_TOKEN=your-bot-token
    ```

## Configuration

1. Update the `config.json` file with your bot's configuration:
    ```json
    {
      "token": "your-bot-token",
      "clientId": "your-client-id",
      "guildIds": ["your-guild-id"]
    }
    ```

2. Ensure you have the necessary JSON files for game and quotes:
    - `game.json`
    - `quotes.json`

## Commands

### Ganzenbord Commands

- **/setupganzenbord**: Setup a new Ganzenbord game from an Excel file.
- **/startganzenbord**: Start the Ganzenbord game.
- **/joinganzenbord**: Join the Ganzenbord game.
- **/roll**: Roll a dice to move on the Ganzenbord board.

### Quote Commands

- **/quote**: Display the quote of the day.
- **/listquotes**: List all quotes.
- **/addquote**: Add a new quote.
- **/deletequote**: Delete a quote.

### Broadcast Commands

- **/broadcast**: Send a broadcast message.
- **/listbroadcast**: List all broadcast messages.
- **/removebroadcast**: Remove a broadcast message.

## Deployment

This project uses GitHub Actions to deploy to Azure Web App.

1. Ensure you have the necessary secrets set in your GitHub repository:
    - `AZURE_WEBAPP_PUBLISH_PROFILE`
    - `AZURE_WEBAPP_NAME`

2. The deployment workflow is defined in [`.github/workflows/main_tfd-bot.yml`](.github/workflows/main_tfd-bot.yml).

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
