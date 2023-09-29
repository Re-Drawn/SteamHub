const { getDatabase, initializeApp } = require('./index')

async function getCreationTime(resultCreationTime) {
    const timeDifference = Date.now() - resultCreationTime
    // 3600000 ms = 1 hr
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
        const outdated = await getCreationTime(result._id.getTimestamp())
        if (outdated) {
            console.log('outdated game info')
            return false
        }
        return result.data
    }
}

module.exports = { appInCache }