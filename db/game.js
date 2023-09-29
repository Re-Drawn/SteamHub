const { getDatabase, initializeApp } = require('./index')

async function getUpdateTime(resultUpdatedTime) {
    const timeDifference = Date.now() - resultUpdatedTime
    // 3600000 ms = 1 hr
    console.log(timeDifference)
    // TODO: Look into MongoDB TTL for auto removal
    if (timeDifference > 3600000) {
        return true
    }
    return false
}

async function appInCache(appID) {
    const db = getDatabase()
    const collection = db.collection('apps')
    const filter = { appID: appID }
    const result = await collection.findOne(filter)
    if (result) {
        // Timestamp is in milliseconds.
        const outdated = await getUpdateTime(result.lastUpdated)
        if (outdated) {
            console.log('outdated game info')
            return false
        }
        return result.data
    }
}

module.exports = { appInCache }