const { SlashCommandBuilder } = require('discord.js')
const { getGlobalLeaderboard } = require('../../db/leaderboard')

async function createEmbed(input) {
    const leaderboard = await getGlobalLeaderboard(input)
    let output = `${input} (most to least): `

    for (user of leaderboard) {
        output = output.concat(`${user.steamName}, `)
    }
    return output.slice(0,-2)
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('globalleaderboard')
        .setDescription('Get the global steam stats leaderboard from all servers across Discord!')
        .addStringOption(option => 
            option.setName('sortby')
            .setDescription('The sorting method to use for the leaderboard.')
            .addChoices(
                { name: 'Number of games', value: 'numGames' },
                { name: 'Number of hours played', value: 'playHours'},
                { name: 'Value of library', value: 'libraryValue'},
                { name: 'Account Age', value: 'accountYears'},
                { name: 'Account Level', value: 'accountXP'}
            )),
        

    async execute(interaction) {
        await interaction.deferReply()
        const input = interaction.options.get('sortby').value
        const embed = await createEmbed(input)
        await interaction.editReply(`${embed}`)
    }
}