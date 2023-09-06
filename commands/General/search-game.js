const { SlashCommandBuilder } = require('discord.js')
const { searchGame } = require('../../fetch_api.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('searchgame')
    .setDescription('Test')
    .addStringOption(option =>
        option.setName('game')
            .setDescription('The game you want to search for')
            .setRequired(true)),

    async execute(interaction) {
        const searchInput = interaction.options.get('game').value
        let raw_games = []
        
        // User input exists
        if (searchInput) {
            raw_games = await searchGame(searchInput)
        }
        
        // Clean json data to readable format
        if (raw_games) {
            let games = []
            for (game of raw_games) {
                games.push(game.name)
            }
            await interaction.reply(`Your search for "${searchInput}" came with these results:\n${games.slice(0,5).join(', ')}`)
        } else {
            await interaction.reply(`Search for "${searchInput}" came up with no results. Please try again.`)
        }
    }
}
