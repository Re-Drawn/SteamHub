const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('finduser')
    .setDescription('Find a user on Steam!')
    .addStringOption(option =>
        option.setName('username')
            .setDescription('The user you want to search for')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const searchInput = interaction.options.get('username').value
        
        await interaction.editReply(`${searchInput}`)
    }
}
