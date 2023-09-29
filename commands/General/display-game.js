const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js')
const { get_app_raw, searchGame, getPlayerCount } = require('../../fetch_api.js')
const { decodeHTMLEntities } = require('../../decode-entities.js')
const { initializeApp } = require('../../db/index.js')
const { appInCache } = require('../../db/game.js')

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
        appRaw = await get_app_raw(appID)
        playerCount = await getPlayerCount(appRaw.steam_appid)
        // TODO: Move all database change functions back into db folder to keep it consistent
        initializeApp(appID, appRaw, playerCount)
    }
    return [ appRaw, playerCount ]
}

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
            return `-${price.discount_percent}% ~~${price.initial_formatted}~~ ${price.final_formatted}`
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

        // TODO: Fix huge if else block
        if (searchRaw) {
            const startTime = Date.now()
            let gameNumber = 0
            let topResultID = searchRaw[gameNumber].appid
            let [ appRaw, playerCount ] = await checkCache(topResultID)
            let appMovies = appRaw.movies
            // TODO: Integrate multiple appid search to get more results without having to query api for every game one at a time
            // https://store.steampowered.com/api/appdetails/?appids=32330,49520&filters=price_overview

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
            
            const buttons = new ActionRowBuilder()
            if (appMovies) {
                buttons.addComponents(trailer)
            }
                buttons.addComponents(wrongGame)
    
            let embed = await createEmbed(appRaw, playerCount, gameNumber)
            const message = await interaction.editReply({ content: `Here is the top result for your search "${searchInput}":`, embeds: [embed], components: [buttons]})
            console.log(`Execution time: ${Date.now()-startTime} ms`)

            const filter = (interaction) => interaction.customId === 'wronggame' || interaction.customId === 'trailer' || interaction.customId === 'back';
            // TODO: Make collector timer increase when trailer button is clicked, but short when not clicked.
            const collector = message.createMessageComponentCollector({ filter, time: 300_000 });

            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                    if (i.customId === 'wronggame') {
                        if (gameNumber < searchRaw.length-1) {
                            gameNumber = gameNumber + 1
                            const startTime = Date.now()
                            topResultID = searchRaw[gameNumber].appid
                            let [ appRaw, playerCount] = await checkCache(topResultID)
                            appMovies = appRaw.movies
                            embed = await createEmbed(appRaw, playerCount, gameNumber)
                            if (appMovies) {
                                buttons.setComponents(trailer, wrongGame)
                            } else {
                                buttons.setComponents(wrongGame)
                            }
                            await message.edit({ content: `Here is the top result for your search "${searchInput}":`, embeds: [embed], components: [buttons]})
                            console.log(`Execution time: ${Date.now()-startTime} ms`)
                            await collector.resetTimer()
                        } else {
                            wrongGame.setLabel("No more results.").setStyle(ButtonStyle.Secondary).setDisabled(true)
                            await message.edit({ content: `Here is the top result for your search "${searchInput}":`, embeds: [embed], components: [buttons]})
                            await collector.resetTimer()
                        }
                    } else if (i.customId === 'trailer') {
                        // TODO: Get video on discord embed in different way
                        buttons.setComponents(back)
                        await message.edit({ content: `${appMovies[0].mp4.max}`, embeds: [], components: [buttons] })
                        await collector.resetTimer()

                    } else if (i.customId === 'back') {

                        if (appMovies) {
                            buttons.setComponents(trailer)
                        }
                        await message.edit({ content: `Here is the top result for your search "${searchInput}":`, embeds: [embed], components: [buttons]})
                        await collector.resetTimer()

                    }
                }
                await i.deferUpdate()
            })

            collector.on('end', async () => {
                await message.edit({ content: `Here is the top result for your search "${searchInput}":`, embeds: [embed], components: []})
            })
        } else {
            await interaction.editReply(`Search for "${searchInput}" came up with no results. Please try again.`)
        }

    }
}