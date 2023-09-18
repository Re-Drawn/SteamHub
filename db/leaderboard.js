const { getDatabase } = require('./index')

async function getGlobalLeaderboard(sortBy) {
    const db = getDatabase()
    const collection = db.collection('leaderboard')

    return collection.find().sort({ [sortBy]: -1 }).toArray()
}

async function updateStatsGlobal(steamName, steamID, numGames, playHours, libraryValue, accountYears, accountLevel, accountXP) {
    const db = getDatabase()
    const collection = db.collection('leaderboard')
    const user = await collection.findOne( { steamID: steamID } )

    if (user) {
        collection.updateOne( { steamID: steamID }, { "$set": { steamName, numGames, playHours, libraryValue, accountYears, accountLevel, accountXP } } )
        console.log("update")
    } else {
        collection.insertOne( { steamName, steamID, numGames, playHours, libraryValue, accountYears, accountLevel, accountXP } )
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

module.exports = { getGlobalLeaderboard, updateStatsGlobal }