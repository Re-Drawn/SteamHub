const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { get_app_raw, searchGame, getPlayerCount } = require('../../fetch_api.js')
const { decodeHTMLEntities } = require('../../decode-entities.js')


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

    try {
        if (price.discount_percent > 0) {
            return `~~${price.initial_formatted}~~ ${price.final_formatted}`
        } else {
            return `${price.final_formatted}`
        }
    } catch(error) {
        console.error(error)
        return "N/A"
    } 

}

function createEmbed(appRaw, playerCount) {
    const embed = new EmbedBuilder()
        .setTitle(appRaw.name)
        .setURL(`https://store.steampowered.com/app/${appRaw.steam_appid}`)
        .setDescription(priceText(appRaw))
        .setImage(appRaw.header_image)
        .addFields (
            // TODO: Format text to fit within limits of discord embeds
            { name: 'Description:', value: `${decodeHTMLEntities(appRaw.short_description)}`}
        )
    
    if (appRaw.metacritic) {
        embed.addFields( {name: 'Metacritic: ', value: `${appRaw.metacritic.score}%`, inline: true})
    } else {
        embed.addFields ( {name: 'Metacritic: ', value: 'N/A', inline: true})
    }
    if (appRaw.genres) {
        let text = `${appRaw.genres[0].description}`
        for (genre of appRaw.genres.slice(1,4)) {
            text = text.concat(", ", `${genre.description}`)
        }
        embed.addFields( { name: 'Genres: ', value: text, inline: true })
    }

    if (playerCount) {
        embed.addFields( {name: 'Player Count: ', value: `${playerCount}`, inline: true})
    } else {
        embed.addFields( {name: 'Player Count: ', value: 'N/A', inline: true})
    }

    if (!appRaw.release_date.coming_soon) {
        embed.setFooter( { text: `Released ${appRaw.release_date.date}`})
    }
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
        await interaction.deferReply()
        const searchInput = interaction.options.get('game').value

        const searchRaw = await searchGame(searchInput)

        if (searchRaw) {
            const topResultID = searchRaw[0].appid
            const appRaw = await get_app_raw(topResultID)
            const playerCount = await getPlayerCount(appRaw.steam_appid)
    
            const embed = await createEmbed(appRaw, playerCount)
            await interaction.editReply({ content: `Here is the top result for your search "${searchInput}":`, embeds: [embed]})
        } else {
            await interaction.editReply(`Search for "${searchInput}" came up with no results. Please try again.`)
        }

    }
}