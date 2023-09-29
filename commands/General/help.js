const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

async function createEmbed() {
    const embed = new EmbedBuilder()
        .setDescription(`───── **/game** ─────
        *Arguments - [Search Query for Game **OR** AppID]*

        Use this command to search up a game's stats such as price, description, ratings, player count, and trailers! This command will get the top result from your search query, but if the game is incorrect, simply click on "Wrong Game"!
        Example: /game "team fortress 2" OR /game 440

        ───── **/gamenews** ─────
        *Arguments - [Search Query for Game **OR** AppID]*
        
        Use this command to search up the latest news about a game!
        
        ───── **/reviews** ─────
        *Arguments - [Search Query for Game **OR** AppID]*
        
        Use this command to get 10 random user reviews about a game you are interested in.
        
        ───── **/userstats** ─────
        *Arguments - [Search Query for Steam User **OR** SteamID]
        
        Use this command to get some statistics about a steam account! This includes things such as number of games in library, price of library, hours spent playing games, and more! If you use a search query, it will give you the top results of the search for you to select from.
        Example: /userstats "ReDrawn" OR /userstats 76561198252274600`)

    return embed
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get command information for this bot!'),
    
    async execute(interaction) {
        const embed = await createEmbed()
        await interaction.reply({ embeds: [embed] , ephemeral: true})
    }
}