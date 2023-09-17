const { getDatabase } = require('./index')

async function createGuild(guildID) {
    const db = getDatabase()
    const collection = db.collection('guilds')
    await collection.insertOne({ guildid: guildID, settings: {language: "en"} })
}

async function getGuild(guildID) {
    const db = getDatabase()
    const collection = db.collection('guilds')
    const filter = { guildid: guildID }
    const result = await collection.findOne(filter)

    return result
}

async function updateGuild(guildID, input) {
    const db = getDatabase()
    const collection = db.collection('guilds')
    const filter = { guildid: guildID }
    console.log(input)

    const update = {
        $set: {
            'settings.language': input
        }
    }
    const result = await collection.findOne(filter)
    if (!result) {
        await createGuild(guildID)
        console.log('GuildID not in database, creating one')
    }

    await collection.updateOne(filter, update)

}

module.exports = { createGuild, getGuild, updateGuild }