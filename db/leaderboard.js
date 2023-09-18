const { getDatabase } = require('./index')

async function updateStatsGlobal(steamID, numGames, playHours, libraryPrice, accountYears, accountLevel, accountXP) {
    const db = getDatabase()
    const collection = db.collection('leaderboard')
    const user = await collection.findOne( { steamID: steamID } )

    if (user) {
        collection.updateOne( { steamID: steamID }, { "$set": { numGames, playHours, libraryPrice, accountYears, accountLevel, accountXP } } )
        console.log("update")
    } else {
        collection.insertOne( { steamID, numGames, playHours, libraryPrice, accountYears, accountLevel, accountXP } )
        console.log("insert")
    }
}

//async function updateNumGames(guildID, steamID, numberOfGames) {
//    const db = getDatabase()
//    const collection = db.collection('guilds')
//    const filter = { guildID: guildID }
//    const leaderboard = await collection.findOne(filter).leaderboard
//    const user = leaderboard.numberOfGames.findOne( { steamID: steamID } )
//
//    if (user) {
//        leaderboard.numberOfGames.updateOne( { steamID: steamID, games: numberOfGames } )
//        console.log("update")
//    } else {
//        leaderboard.numberOfGames.insertOne( { steamID: steamID, games: numberOfGames } )
//        console.log("insert")
//    }
//
//}

module.exports = { updateStatsGlobal }