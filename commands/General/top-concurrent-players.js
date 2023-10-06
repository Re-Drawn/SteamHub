const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { getAppOverviews, getTopConcurrentPlayers, getAppList } = require('../../fetch-api.js')

const next = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("▶️")
    .setStyle(ButtonStyle.Secondary)
const prev = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("◀️")
    .setStyle(ButtonStyle.Secondary)

let concurrentRaw
let appData = new Array(100).fill(0)

async function updateInfo() {
    concurrentRaw = await getTopConcurrentPlayers()
    const appIDs = []
    for (game of concurrentRaw.ranks) {
        appIDs.push(game.appid)
    }

    const listResult = await getAppList(appIDs)
    // TODO: Clean up
    for (page of listResult) {
        for (app of page) {
            let idx = appIDs.indexOf(app.appid)
            if (idx != -1) {
                appData[idx] = app
            }
        }
    }
}

updateInfo()
setInterval(updateInfo, 1800000)

function createEmbed(concurrentRaw, appData, pageNum) {

    let gameText = ""
    let playerText = ""

    // TODO: Fix for mobile/small screen (it lays the fields out vertically instead of horizontally)
    for (let i = pageNum*10; i < pageNum*10+10; i++) {
        if (appData[i]) {
            gameText = gameText.concat(`│ ${i+1}. ${appData[i].name}\n`)
            playerText = playerText.concat(`│ ${concurrentRaw.ranks[i].concurrent_in_game} players\n`)
        } else {
            gameText = gameText.concat(`│ ${i+1}. *Error loading.*\n`)
            playerText = playerText.concat(`│ *Error loading.*\n`)
        }
    }

    const embed = new EmbedBuilder()
        .setFields(
            { name: '│ Game', value: gameText, inline: true},
            { name: '│ Player Count', value: playerText, inline: true}
        )
        .setFooter({ text: `Page ${pageNum+1}/10`})
    return embed
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('topplayercount')
        .setDescription('Get the top 100 games by concurrent player count'),
    
    async execute(interaction) {
        await interaction.deferReply()

        // FIXME: Empty array results such as tModLoader and Rocket League
        let pageNum = 0
        let embed = await createEmbed(concurrentRaw, appData, pageNum)
        const actionRow = new ActionRowBuilder()
            .addComponents(next)
        
        const message = await interaction.editReply({ embeds: [embed], components: [actionRow] })
        const filter = (interaction) => interaction.customId === 'next' || interaction.customId === 'prev'
        const collector = message.createMessageComponentCollector({ filter, time: 60_000 })

        collector.on('collect', async i => {
            // Only user who issued command
            if (i.user.id != interaction.user.id) return

            if (i.customId === 'next' && pageNum < 9) {
                pageNum += 1
                if (pageNum == 9) {
                    actionRow.setComponents(prev)
                } else {
                    actionRow.setComponents(prev, next)
                }
            } else if (i.customId === 'prev' && pageNum > 0) {
                pageNum -= 1
                if (pageNum == 0) {
                    actionRow.setComponents(next)
                } else {
                    actionRow.setComponents(prev, next)
                }
            }
            embed = await createEmbed(concurrentRaw, data, pageNum)
            message.edit({ embeds: [embed], components: [actionRow] })
            await collector.resetTimer()
            await i.deferUpdate()
        })

    }

}