const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { get_app_raw, searchGame, getUser, userReviews } = require('../../fetch_api.js')

function createEmbed(appRaw, reviewsRaw, userRaw, reviewNum) {
    const unixTime = reviewsRaw[reviewNum].timestamp_created
    const date = new Date(unixTime * 1000)
    const username = userRaw.persona_name

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${username}`, iconURL: `https://avatars.akamai.steamstatic.com/${userRaw.avatar_url}.jpg` })
        .setURL(`https://store.steampowered.com/app/${appRaw.steam_appid}`)
        .setDescription(reviewsRaw[reviewNum].review)
        .setImage(appRaw.header_image)
        .setFooter({ text: `Review ${reviewNum+1}/${reviewsRaw.length} | ${date.toLocaleDateString("en-US")}` })
    
    return embed
}

async function cycleReviews(appRaw, reviewsRaw, message, interaction) {
    interaction.reviewNum = interaction.reviewNum + 1
    userRaw = await getUser(reviewsRaw[interaction.reviewNum].author.steamid)
    embed = await createEmbed(appRaw, reviewsRaw, userRaw, interaction.reviewNum)
    message.edit({ content: `Here are some reviews for ${appRaw.name}:`, embeds: [embed] })
}

module.exports = {
    data: new SlashCommandBuilder()
    
        .setName('reviews')
        .setDescription('Get a random steam review from your desired game!')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('The game you want to search for')),

    async execute(interaction) {
        const searchInput = interaction.options.get('game').value
        const searchRaw = await searchGame(searchInput)

        if (searchRaw) {
            // Defer reply to give time for apis to respond
            await interaction.deferReply()
            const topResultID = searchRaw[0].appid
            const appRaw = await get_app_raw(topResultID)
            const reviewsRaw = await userReviews(topResultID)

            // TODO: Find better way to pass reviewNum value as reference not value
            interaction.reviewNum = 0
            let userRaw = await getUser(reviewsRaw[interaction.reviewNum].author.steamid)
            let embed = await createEmbed(appRaw, reviewsRaw, userRaw, interaction.reviewNum)

            const message = await interaction.editReply({ content: `Here are some reviews for ${appRaw.name}:`, embeds: [embed], fetchReply: true})

            
            // TODO: Change this so it rotates with reactions instead of 5 second intervals
            var interval = setInterval(function() {
                if (interaction.reviewNum >= reviewsRaw.length-1) {
                    clearInterval(interval)
                } else {
                    cycleReviews(appRaw, reviewsRaw, message, interaction)
                }
            }, 5000)
            
        } else {
            await interaction.reply(`Search for "${searchInput}" came up with no results. Please try again.`)
        }
    }
}