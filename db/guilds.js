const { getDatabase, initializeGuild } = require('./index')

async function getGuild(guildID) {
    const db = getDatabase()
    const collection = db.collection('guilds')
    const filter = { guildID: guildID }
    const result = await collection.findOne(filter)

    if (!result) {
        result = await initializeGuild(guildID)
    }

    return result
}

async function updateGuild(guildID, input) {
    const db = getDatabase()
    const collection = db.collection('guilds')
    const filter = { guildID: guildID }

    const update = {
        $set: {
            'settings.language': input
        }
    }
    const result = await collection.findOne(filter)
    // TODO: Add failsafe for initializeGuild fail
    if (!result) {
        await initializeGuild(guildID)
        console.log('GuildID not in database, creating one')
    }

    await collection.updateOne(filter, update)

}


module.exports = { getGuild, updateGuild }