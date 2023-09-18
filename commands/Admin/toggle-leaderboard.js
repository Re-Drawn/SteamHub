const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { toggleLeaderboard } = require('../../db/guilds')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleleaderboard')
        .setDescription('Enable or disable the steam leaderboard for this server.')
        .addBooleanOption(option => 
            option.setName('toggle')
            .setDescription('True or False')
            .setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply()
        const input = interaction.options.get('toggle').value
        await toggleLeaderboard(interaction.member.guild.id, input)
        await interaction.editReply(`The leaderboard is now toggled ${input} for this server.`)
    }
}