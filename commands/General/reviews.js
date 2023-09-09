const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { get_app_raw, searchGame, getUser, userReviews } = require('../../fetch_api.js')

function createEmbed(appRaw, reviewsRaw, userRaw) {
    const unixTime = reviewsRaw[0].timestamp_created
    const date = new Date(unixTime * 1000)
    const username = userRaw.persona_name

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${username}`, iconURL: `https://avatars.akamai.steamstatic.com/${userRaw.avatar_url}.jpg` })
        .setURL(`https://store.steampowered.com/app/${appRaw.steam_appid}`)
        .setDescription(reviewsRaw[0].review)
        .setImage(appRaw.header_image)
        .setFooter({ text: `${date.toLocaleDateString("en-US")}` })
    
    return embed
}

async function getReactions(interaction, message) {
    const reactionFilter = (reaction, user) => {
        return reaction.emoji.name === '▶️' && user.id === interaction.user.id
    }

    // Reaction messages
    message.react('▶️')

    message.awaitReactions({ filter: reactionFilter, max: 10, time: 10000})
        .then(collected => console.log("AHHHHHHHH"))
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
            const topResultID = searchRaw[0].appid
            const appRaw = await get_app_raw(topResultID)
            const reviewsRaw = await userReviews(topResultID)
            const userRaw = await getUser(reviewsRaw[0].author.steamid)

            const embed = await createEmbed(appRaw, reviewsRaw, userRaw)
            const message = await interaction.reply({ content: `Here are some reviews for ${appRaw.name}:`, embeds: [embed], fetchReply: true})

            const filter = (reaction, user) => {
                return ['👍','🙃'].includes(reaction.emoji.name);
            }
        }
    }
}