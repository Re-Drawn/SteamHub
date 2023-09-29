const { SlashCommandBuilder, PermissionFlagBits } = require('discord.js')
const { updateGuild } = require('../../db/guilds')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setlanguage')
    .setDescription('Set the language of command outputs for this server.')
    .addStringOption(option =>
        option.setName('language')
        .setDescription('The language to set')
        .setRequired(true)
        .addChoices(
            { name: 'български език', value: 'bulgarian'},
            { name: '简体中文', value: 'schinese'},
            { name: 'čeština', value: 'czech'},
            { name: 'Dansk', value: 'danish'},
            { name: 'Nederlands', value: 'dutch'},
            { name: 'English', value: 'english'},
            { name: 'Suomi', value: 'finnish'},
            { name: 'Français', value: 'french'},
            { name: 'Deutsch', value: 'german'},
            { name: 'Magyar', value: 'hungarian'},
            { name: 'Bahasa Indonesia', value: 'indonesian'},
            { name: 'Italiano', value: 'italian'},
            { name: '日本語', value: 'japanese'},
            { name: '한국어', value: 'koreana'},
            { name: 'Norsk', value: 'norwegian'},
            { name: 'Polski', value: 'polish'},
            { name: 'Português', value: 'portuguese'},
            { name: 'Română', value: 'romanian'},
            { name: 'Русский', value: 'russian'},
            { name: 'Español', value: 'spanish'},
            { name: 'Svenska', value: 'swedish'},
            { name: 'ไทย', value: 'thai'},
            { name: 'Türkçe', value: 'turkish'},
            { name: 'Українська', value: 'ukrainian'},
            { name: 'Tiếng Việt', value: 'vietnamese'})),
    
    async execute(interaction) {
        await interaction.deferReply()
        const input = interaction.options.get('language').value
        await updateGuild(interaction.member.guild.id, input)
        await interaction.editReply(`The bot's commands will now be in ${input} for this server.`)
    }
}