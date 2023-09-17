const { SlashCommandBuilder, PermissionFlagBits } = require('discord.js')
const { createGuild, getGuild, updateGuild } = require('../../db/guilds')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setlanguage')
    .setDescription('Set the language of command outputs for this server.')
    .addStringOption(option =>
        option.setName('language')
        .setDescription('The language to set')
        .setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply()
        const input = interaction.options.get('language').value
        await updateGuild(interaction.member.guild.id, input)
        await interaction.editReply(`The bot's commands will now be in ${input} for this server.`)
    }
}