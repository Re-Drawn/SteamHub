require('dotenv').config()
const { MongoClient } = require('mongodb')

const url = process.env.DB_URL
let db

async function connectToDatabase() {
    const client = new MongoClient(url)

    try {
        await client.connect()
        db = client.db("appdb")
        console.log("Connected to database")
    } catch(e) {
        console.log(e)
    }
}

function getDatabase() {
    if (db) {
        return db
    } else {
        console.error("Not connected to database")
    }
}

async function initializeGuild(guildID) {
    const collection = db.collection('guilds')
    await collection.insertOne({ guildID: guildID, settings: {language: "english"} })
}

async function initializeApp(appID, appRaw, playerCount) {
    const collection = db.collection('apps')
    const filter = { appID: appID }
    const result = await collection.findOne(filter)
    if (result) {
        console.log("update")
        await collection.updateOne(result, { "$set": { appID: appID, data: { appRaw: appRaw, playerCount: playerCount }, lastUpdated: Date.now() } })
    } else {
        await collection.insertOne({ appID: appID, data: { appRaw: appRaw, playerCount: playerCount }, lastUpdated: Date.now() })
    }
}

module.exports = { connectToDatabase, getDatabase, initializeGuild, initializeApp }