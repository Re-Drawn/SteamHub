const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js')
const { getApp, searchGame, getPlayerCount } = require('../../fetch-api.js')
const { decodeHTMLEntities } = require('../../decode-entities.js')
const { initializeApp } = require('../../db/index.js')
const { appInCache } = require('../../db/game.js')

const trailer = new ButtonBuilder()
    .setCustomId('trailer')
    .setLabel('Trailer')
    .setStyle(ButtonStyle.Primary)
const wrongGame = new ButtonBuilder()
    .setCustomId('wronggame')
    .setLabel('Wrong Game?')
    .setStyle(ButtonStyle.Danger)
const back = new ButtonBuilder()
    .setCustomId('back')
    .setLabel('Back')
    .setStyle(ButtonStyle.Secondary)

async function checkCache(appID) {
    const inCache = await appInCache(appID)
    let appRaw, playerCount
    if (inCache) {
        // FIXME: If a server has a different language, that language's app info goes into the cache and will output that language no matter the server settings
        console.log('found in cache')
        appRaw = inCache.appRaw
        playerCount = inCache.playerCount
    } else {
        console.log('new entry or outdated entry')
        appRaw = await getApp(appID)
        playerCount = await getPlayerCount(appRaw.steam_appid)
        // TODO: Move all database change functions back into db folder to keep it consistent
        initializeApp(appID, appRaw, playerCount)
    }
    return [ appRaw, playerCount ]
}

function priceText(appRaw) {

    if (appRaw.release_date.coming_soon) return `Coming Soon: ${appRaw.release_date.date}`
    if (appRaw.is_free) return "Free"

    try {
        const price = appRaw.price_overview
        if (price.discount_percent > 0) {
            return `-${price.discount_percent}% ~~${price.initial_formatted}~~ ${price.final_formatted}`
        }
        return `${price.final_formatted}`
    } catch(error) {
        return "N/A"
    } 

}

async function resolveGame(interaction, message, searchRaw, actionRow, searchInput) {

    const menu = new StringSelectMenuBuilder()
        .setCustomId('resolvegame')
        .setPlaceholder("Select the game you're looking for")
    
    for (let i = 0; i < searchRaw.length; i++) {
        let option = new StringSelectMenuOptionBuilder()
            .setLabel(searchRaw[i].name)
            .setValue(searchRaw[i].appid)
        menu.addOptions(option)
    }

    actionRow.setComponents(menu)
    await message.edit( {content: '', embeds: [], components: [actionRow]} )

    const collector = message.createMessageComponentCollector({ time: 300_000 })
    collector.on('collect', async i => {
        if (i.user.id != interaction.user.id) return

        collector.stop()
        embed = await setupAppReply(i.values[0], message, actionRow, searchInput)
        await i.deferUpdate()
    })
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
    
    if (appRaw.genres) {
        let text = `${appRaw.genres[0].description}`
        for (genre of appRaw.genres.slice(1,4)) {
            text = text.concat(", ", `${genre.description}`)
        }
        embed.addFields( { name: 'Genres: ', value: text, inline: true })
    }

    let metacriticField = {name: 'Metacritic: ', inline: true}
    metacriticField['value'] = appRaw.metacritic ? `${appRaw.metacritic.score}%` : 'N/A'
    embed.addFields(metacriticField)

    let playerCountField = {name: 'Player Count: ', inline: true}
    playerCountField['value'] = playerCount ? `${playerCount}` : 'N/A'
    embed.addFields(playerCountField)

    if (!appRaw.release_date.coming_soon) {
        embed.setFooter( { text: `Released ${appRaw.release_date.date}`})
    }
    return embed
}

async function setupAppReply(appID, message, actionRow) {
    let [ appRaw, playerCount ] = await checkCache(appID)
    appMovies = appRaw.movies
    const embed = await createEmbed(appRaw, playerCount)

    actionRow.setComponents()
    if (appMovies) actionRow.addComponents(trailer)
    wrongGame.setStyle(ButtonStyle.Danger).setLabel('Wrong Game?').setDisabled(false)
    actionRow.addComponents(wrongGame)

    await message.edit( {content: '', embeds: [embed], components: [actionRow]})
    return embed
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Test')
        .addStringOption(option => 
            option.setName('game')
                .setDescription('The game you want to search for')
                .setRequired(true)),

    async execute(interaction) {
        // TODO: See if use of select menus can prove to be worth it
        const message = await interaction.deferReply()
        const searchInput = interaction.options.get('game').value
        const searchRaw = await searchGame(searchInput)
    
        if (!searchRaw) {
            await interaction.editReply(`Search for "${searchInput}" came up with no results. Please try again.`)
            return
        }

        const actionRow = new ActionRowBuilder()
        let embed = await setupAppReply(searchRaw[0].appid, message, actionRow, searchInput)
        // TODO: Integrate multiple appid search to get more results without having to query api for every game one at a time
        // https://store.steampowered.com/api/appdetails/?appids=32330,49520&filters=price_overview

        const filter = (interaction) => interaction.customId === 'wronggame' || interaction.customId === 'trailer' || interaction.customId === 'back'
        // TODO: Make collector timer increase when trailer button is clicked, but short when not clicked.
        const collector = message.createMessageComponentCollector({ filter, time: 300_000 })

        collector.on('collect', async i => {
            if (i.user.id != interaction.user.id) {
                await i.reply( { content: 'You are not the command user! Please use the command yourself.', ephemeral: true } )
                return
            }

            switch(i.customId) {
                case 'wronggame':
                    if (searchRaw.length > 1) {
                        await resolveGame(interaction, message, searchRaw, actionRow, searchInput)
                    } else {
                        actionRow.setComponents(trailer)
                        await interaction.followUp({ content: 'No other results. Please broaden your search input to get more results.', ephemeral: true })
                        await message.edit({ content: '', embeds: [embed], components: [actionRow]})
                    }
                    break
                case 'trailer':
                    // TODO: Get video on discord embed in different way
                    actionRow.setComponents(back)
                    await message.edit({ content: `${appMovies[0].mp4.max}`, embeds: [], components: [actionRow] })
                    break
                case 'back':
                    if (appMovies) actionRow.setComponents(trailer)
                    actionRow.addComponents(wrongGame)
                    await message.edit({ content: '', embeds: [embed], components: [actionRow]})
            }
            await collector.resetTimer()
            await i.deferUpdate()
        })

        collector.on('end', async () => {
            await message.edit({ content: '', embeds: [embed], components: []})
        })

    }
}