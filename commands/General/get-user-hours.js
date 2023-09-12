const { SlashCommandBuilder } = require('discord.js')
const { getUserGames } = require('../../fetch_api.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('getuserhours')
    .setDescription("Find a user's hours on Steam!")
    .addStringOption(option =>
        option.setName('steamid')
            .setDescription('The user you want to search for')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const searchInput = interaction.options.get('steamid').value
        const games = await getUserGames(searchInput)
        if (games) {
            let output = ""
            for (let i = -1; i > -10; i--) {
                output = output.concat(`${games.at(i).name}: ${Math.round(games.at(i).playtime_forever/60*100)/100} hours`, ", ")
            }
            output = output.concat(`${games.at(-10).name}: ${Math.round(games.at(-10).playtime_forever/60*100)/100} hours`)
            
            await interaction.editReply(`${output}`)
        } else {
            await interaction.editReply("This profile is private!\n<https://steamcommunity.com/my/edit/settings>\nPlease click the link above and uncheck the 'Always keep my total playtime private' option.")
        }
    }
}
