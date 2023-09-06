const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { get_app_raw, searchGame } = require('../../fetch_api.js')


function priceText(appRaw) {

    const isFree = appRaw.is_free
    const price = appRaw.price_overview
    const release = appRaw.release_date

    if (release.coming_soon) {
        return `Coming Soon: ${release.date}`
    }
    if (isFree) {
        return "Free"
    }

    if (price.discount_percent > 0) {
        return `~~${price.initial_formatted}~~ ${price.final_formatted}`
    } else {
        return `${price.final_formatted}`
    }

}

function createEmbed(appRaw) {
    const embed = new EmbedBuilder()
        .setTitle(appRaw.name)
        .setURL(`https://store.steampowered.com/app/${appRaw.steam_appid}`)
        .setDescription(priceText(appRaw))
        .setImage(appRaw.header_image)
        .addFields (
            { name: 'Description:', value: `${appRaw.short_description}`},

        )
    
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