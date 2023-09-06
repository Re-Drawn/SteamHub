const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { get_app_raw, searchGame } = require('../../fetch_api.js')

function createEmbed(appRaw) {
    const embed = new EmbedBuilder()
        .setTitle(appRaw.name)
        .setURL(`https://store.steampowered.com/app/${appRaw.steam_appid}`)
        .setImage(appRaw.header_image)
    
    return embed
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('game')
    .setDescription('Test')
    .addStringOption(option => 
        option.setName('game')
            .setDescription('The game you want to search for')),

    async execute(interaction) {
        const searchInput = interaction.options.get('game').value

        const searchRaw = await searchGame(searchInput)

        if (searchRaw) {
            const topResultID = searchRaw[0].appid
            const appRaw = await get_app_raw(topResultID)
    
            const embed = await createEmbed(appRaw)
            await interaction.reply({ embeds: [embed]})
        } else {
            await interaction.reply("Search came with no results. Please try again.")
        }

    }
}