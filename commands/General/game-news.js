const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getApp, searchGame, getGameNews } = require('../../fetch-api.js') 

async function createEmbed(appRaw, steamNews) {
    const embed = new EmbedBuilder()
        .setAuthor( { name: `${appRaw.name}`, url: `http://steamcommunity.com/app/${appRaw.steam_appid}`})
        .setTitle(steamNews.title)
        .setURL(steamNews.url)
        .setThumbnail(`${appRaw.header_image}`)
        .setDescription(steamNews.contents)

    return embed
}

// TODO: Make this run in background on servers as an update feed

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gamenews')
    .setDescription('Search for a game and get the latest news!')
    .addStringOption(option =>
        option.setName('game')
            .setDescription('The game you want to search for')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const searchInput = interaction.options.get('game').value
        const searchRaw = await searchGame(searchInput)

        if (!searchRaw) {
            await interaction.editReply(`Search for "${searchInput}" came up with no results. Please try again.`)
            return
        }

        const appRaw = await getApp(searchRaw[0].appid)
        const newsRaw = await getGameNews(searchRaw[0].appid)

        // TODO: Clean up
        // Clean up html to readable format
        // Bold
        newsRaw[0].contents = newsRaw[0].contents.replace(/\[b\]/g, '**')
        newsRaw[0].contents = newsRaw[0].contents.replace(/\[\/b\]/g, '**')
        // Italics
        newsRaw[0].contents = newsRaw[0].contents.replace(/\[i\]/g, '*')
        newsRaw[0].contents = newsRaw[0].contents.replace(/\[\/i\]/g, '*')
        // List items
        newsRaw[0].contents = newsRaw[0].contents.replace(/\[\*\]/g, '⦁ ')
        // Steam images
        newsRaw[0].contents = newsRaw[0].contents.replace(/{STEAM_CLAN_IMAGE}.*?\.png/g, '')

        // Grab all urls with [url]text[/url] tag to reformat to discord intext urls [text](url)
        let urls = newsRaw[0].contents.match(/\[url=.*?\].*?\[\/url\]/g)
        if (urls) {
            for (url of urls) {
                let split = []
                split = url.split("[").join("").split("]")
                split[0] = split[0].slice(4)
                split[1] = split[1].slice(0, -4)
                newsRaw[0].contents = newsRaw[0].contents.replace(`${url}`, `<{{${split[1]}}}>(${split[0]})`)
            }
        }

        // Remove all other tags
        newsRaw[0].contents = newsRaw[0].contents.replace(/\[.*?\]/g, '')
        // Change url tags back to normal
        newsRaw[0].contents = newsRaw[0].contents.replace(/<{{/g, "[")
        newsRaw[0].contents = newsRaw[0].contents.replace(/}}>/g, "]")

        const embed = await createEmbed(appRaw, newsRaw[0])
        await interaction.editReply({ embeds: [embed] })
    }
}