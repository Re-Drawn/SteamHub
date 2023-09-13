const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { getUser, getUserGames } = require('../../fetch_api.js')

async function createEmbed(isPrivate, userRaw, gamesRaw) {

    if (!isPrivate) {
        let gameHours = ""

        for (let i = -1; i > -10; i--) {
            gameHours = gameHours.concat(`${-i}. ${gamesRaw.games.at(i).name}: ${Math.round(gamesRaw.games.at(i).playtime_forever/60*100)/100} hours`, "\n")
        }
        gameHours = gameHours.concat(`10. ${gamesRaw.games.at(-10).name}: ${Math.round(gamesRaw.games.at(-10).playtime_forever/60*100)/100} hours`)
    
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${userRaw.persona_name}`, url: `https://steamcommunity.com/profiles/${userRaw.steamid}`, iconURL: `https://avatars.akamai.steamstatic.com/${userRaw.avatar_url}_full.jpg`})
            .setDescription(`Games owned: ${gamesRaw.game_count}`)
            .addFields(
                { name: 'Games by hours: ', value: `${gameHours}`}
            )
        
        return embed
    } else {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${userRaw.persona_name}`, url: `https://steamcommunity.com/profiles/${userRaw.steamid}`, iconURL: `https://avatars.akamai.steamstatic.com/${userRaw.avatar_url}_full.jpg`})
            .setDescription(`**This user's profile is private!**\nIf this is your profile, follow the link below and uncheck the 'Always keep my total playtime private' option.\nhttps://steamcommunity.com/my/edit/settings\n*Please wait a couple minutes after changing the setting for this to update!*`)
        return embed
    }

}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('getuserhours')
    .setDescription("Find a user's hours on Steam!")
    .addStringOption(option =>
        option.setName('steamid')
            .setDescription('The user you want to search for')
            .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const searchInput = interaction.options.get('steamid').value
        if (!parseInt(searchInput)) {
            await interaction.editReply(`Invalid parameter "${searchInput}", please try again.`)
            return
        }
        const user = await getUser(searchInput)
        const games = await getUserGames(searchInput)

        if (games) {
            const embed = await createEmbed(false, user, games)
            await interaction.editReply( { embeds: [embed] })
        } else {
            const embed = await createEmbed(true, user)
            await interaction.editReply( { embeds: [embed] })
        }

    }
}
