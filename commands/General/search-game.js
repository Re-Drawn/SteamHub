const { SlashCommandBuilder } = require('discord.js')
const { searchGame } = require('../../fetch_api.js')

const data = new SlashCommandBuilder()
    .setName('searchgame')
    .setDescription('Test')
    .addStringOption(option =>
        option.setName('game')
            .setDescription('The game you want to search for')
            .setRequired(true))

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

        if (searchInput) {
            const games = await searchGame(searchInput)
            console.log(games[0])
        }
        //await interaction.reply(searchInput[0])
        await interaction.reply('Pong!')
    }
}
