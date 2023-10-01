const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { getApp, searchGame, getUser, userReviews } = require('../../fetch-api.js')

const next = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("▶️")
    .setStyle(ButtonStyle.Secondary)
const prev = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("◀️")
    .setStyle(ButtonStyle.Secondary)


function createEmbed(appRaw, reviewsRaw, userRaw, reviewNum) {
    const unixTime = reviewsRaw[reviewNum].timestamp_created
    const date = new Date(unixTime * 1000)
    let profileLink

    if (userRaw.profile_url != '') {
        profileLink = `id/${userRaw.profile_url}`
    } else {
        profileLink = `profiles/${userRaw.steamid}`
    }

    // TODO: Limit review length to <= 4096
    const embed = new EmbedBuilder()
        .setAuthor({ name: `${userRaw.persona_name}`, url: `https://steamcommunity.com/${profileLink}/recommended/`, iconURL: `https://avatars.akamai.steamstatic.com/${userRaw.avatar_url}.jpg` })
        .setURL(`https://store.steampowered.com/app/${appRaw.steam_appid}`)
        .setImage(appRaw.header_image)
        .setFields(
            { name: 'Hours Played:', value: `${Math.round(reviewsRaw[reviewNum].author.playtime_forever/60*100)/100}`, inline: true},
            { name: 'Helpful Votes: ', value: `${reviewsRaw[reviewNum].votes_up}`, inline: true},
            { name: 'Funny Votes: ', value: `${reviewsRaw[reviewNum].votes_funny}`, inline: true}
        )
        .setFooter({ text: `Review ${reviewNum+1}/${reviewsRaw.length} | ${date.toLocaleDateString("en-US")}` })

    if (reviewsRaw[reviewNum].voted_up) {
        embed.setThumbnail("https://community.akamai.steamstatic.com/public/shared/images/userreviews/icon_thumbsUp.png?v=1")
    } else {
        embed.setThumbnail("https://community.akamai.steamstatic.com/public/shared/images/userreviews/icon_thumbsDown.png?v=1")
    }

    try {
        embed.setDescription(reviewsRaw[reviewNum].review)
    } catch (error) {
        console.log(error)
        embed.setDescription("*Error loading review.*")
    }

    return embed
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

        if (!searchRaw) {
            await interaction.reply(`Search for "${searchInput}" came up with no results. Please try again.`)
            return
        }

        // Defer reply to give time for apis to respond
        await interaction.deferReply()
        const appRaw = await getApp(searchRaw[0].appid)
        const reviewsRaw = await userReviews(searchRaw[0].appid)

        if (!reviewsRaw) {
            await interaction.editReply(`"${appRaw.name}" has no reviews currently!`)
            return
        }

        let reviewNum = 0
        let userRaw = await getUser(reviewsRaw[reviewNum].author.steamid)
        let embed = await createEmbed(appRaw, reviewsRaw, userRaw, reviewNum)

        const actionRow = new ActionRowBuilder()
        if (reviewsRaw.length > 1) actionRow.addComponents(next)

        const message = await interaction.editReply({ content: `Here are some reviews for ${appRaw.name}:`, embeds: [embed]})
        if (actionRow.components.length > 0) message.edit({components: [actionRow]})
        
        const filter = (interaction) => interaction.customId === 'next' || interaction.customId === 'prev';
        const collector = message.createMessageComponentCollector({ filter, time: 60_000 });
        collector.on('collect', async i => {
            // Only user who issued command
            if (i.user.id != interaction.user.id) return

            if (i.customId === 'next' && reviewNum < reviewsRaw.length-1) {
                reviewNum += 1
                if (reviewNum == reviewsRaw.length-1) {
                    actionRow.setComponents(prev)
                } else {
                    actionRow.setComponents(prev, next)
                }
            } else if (i.customId === 'prev' && reviewNum > 0) {
                reviewNum -= 1
                if (reviewNum == 0) {
                    actionRow.setComponents(next)
                } else {
                    actionRow.setComponents(prev, next)
                }
            }
            userRaw = await getUser(reviewsRaw[reviewNum].author.steamid)
            embed = await createEmbed(appRaw, reviewsRaw, userRaw, reviewNum)
            message.edit({ content: `Here are some reviews for ${appRaw.name}:`, embeds: [embed], components: [actionRow] })
            await collector.resetTimer()
            // Required for component interaction
            await i.deferUpdate()
        })

        // Get rid of components when collection window ends
        collector.on('end', async () => {
            await message.edit({ content: `Here are some reviews for ${appRaw.name}:`, embeds: [embed], components: [] })
        });
    }
}