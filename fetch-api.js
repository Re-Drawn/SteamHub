const axios = require('axios')
const { JSDOM } = require('jsdom')
const { getGuild } = require('./db/guilds')
require('dotenv').config()

// TODO: Add support for different country prices & languages
async function getApp(appID, guildID) {
    /*const guild = await getGuild(guildID)
    let language = "english"
    if (guild) {
        language = guild.settings.language
    }*/

    // TODO: Get rid of this function with getApp as replacement
    const headers = {
        method: 'GET',
        // TODO: Get detailed_description on api instead of short_description for different languages
        // Or use translator package
        url: `https://store.steampowered.com/api/appdetails?appids=${appID}`
    }

    try {
        const response = await axios.request(headers);
        if (response.data[appID].success) {
            return response.data[appID].data
        } else {
            console.log("Doesn't exist")
        }
    } catch (error) {
        console.error(error);
    }

}

async function userReviews(appID) {
    const headers = {
        method: 'GET',
        url: `https://store.steampowered.com/appreviews/${appID}?cursor=*&json=1&filter=summary`
    }

    try {
        const response = await axios.request(headers);
        if (response.data.success) {
            if (response.data.query_summary.review_score_desc == "No user reviews") {
                return false
            }
            return response.data.reviews

        }
        return false

    } catch (error) {
        console.error(error);
    }

}

async function getUser(steamID) {
    const headers = {
        method: 'GET',
        url: `https://steamcommunity.com/actions/ajaxresolveusers?steamids=${steamID}`
    }

    try {
        const response = await axios.request(headers);
        if (response.data) {
            return response.data[0]
        } else {
            console.log("Doesn't exist")
            return false
        }
    } catch (error) {
        console.error(error);
    }

}

async function searchGame(searchQuery) {

    const headers = {
        method: 'GET',
        url: `https://steamcommunity.com/actions/SearchApps/${searchQuery}`
    }

    try {
        const response = await axios.request(headers);
        if (response.data.length > 0) {
            return response.data
        } else {
            console.log("Search came up with no results")
            return false
        }
    } catch (error) {
        console.error(error);
    }
}

async function getGameNews(appID) {
    const headers = {
        method: 'GET',
        url: `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appID}&feeds=steam_community_announcements`
    }

    try {
        const response = await axios.request(headers);
        if (response.data) {
            return response.data.appnews.newsitems
        } else {
            console.log("Search came up with no results")
        }
    } catch (error) {
        console.error(error);
    }
}

async function getPlayerCount(appID) {

    const headers = {
        method: 'GET',
        url: `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=${process.env.STEAM_TOKEN}&appid=${appID}`
    }

    try {
        const response = await axios.request(headers)
        if (response.data) {
            return response.data.response.player_count
        }
    } catch (error) {
        console.error(error)
        return false
    }

}

async function getUserBadges(steamID) {

    const headers = {
        method: 'GET',
        url: `https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=${process.env.STEAM_TOKEN}&steamid=${steamID}`
    }

    try {
        const response = await axios.request(headers)
        if (response.data.response) {
            return response.data.response
        } else {
            return false
        }
    } catch (error) {
        console.error(error)
        return false
    }
}

async function resolveVanityURL(vanity) {
    const headers = {
        method: 'GET',
        url: `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAM_TOKEN}&vanityurl=${vanity}`
    }

    try {
        const response = await axios.request(headers)
        if (response.data) {
            return response.data.response.steamid
        }
    } catch (error) {
        console.error(error)
    }
}

async function searchUser(username) {
    // Get a session ID to make AJAX request later
    const headers = {
        url: 'https://steamcommunity.com/'
    }

    let sessionID = null

    try {
        const response = await axios.request(headers)
        // TODO: Find better way to get sessionID from headers
        sessionID = response.headers['set-cookie'][0].split('=').join(";").split(';')[1]
    } catch (error) {
        console.error(error)
    }

    if (sessionID) {
        const headers = {
            method: 'GET',
            url: `https://steamcommunity.com/search/SearchCommunityAjax?text=${username}&filter=users&sessionid=${sessionID}&page=1`,
            headers: {
                // Set sessionid cookie to authenticate to steam
                Cookie: `sessionid=${sessionID}`
            }
        }

        try {
            let ids = []
            const response = await axios.request(headers)
            if (response.data.success) {
                // Create HTML parser to get users from response HTML
                const parser = new JSDOM(response.data.html).window.document
                for (let i = 0; i < (Math.min(response.data.search_result_count, 20)); i++) {
                    let url = parser.getElementsByClassName("searchPersonaName").item(i).getAttribute("href").split('/').slice(-2)
                    if (url[0] == "id") {
                        url[1] = await resolveVanityURL(url[1])
                    }
                    ids.push(url[1])
                    
                }
                return ids
            }
        } catch (error) {
            console.log(error)
        }
    }
}

function sortGames(property) {
    return function(a,b) {
        if(a[property] > b[property]) {
            return 1
        } else if (a[property] < b[property]) {
            return -1
        }
        return 0
    }
}

async function getUserGames(steamID) {
    const headers = {
        method: 'GET',
        url: `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_TOKEN}&steamid=${steamID}&include_appinfo=true&include_played_free_games=true`
    }

    try {
        const response = await axios.request(headers)
        if (response.data.response.game_count) {
            response.data.response.games = response.data.response.games.sort(sortGames("playtime_forever"))
            return response.data.response
        } else {
            console.log("User profile private")
            return false
        }
    } catch (error) {
        console.error(error)
    }
}

async function getAppOverviews(appIDs) {

    // TODO: Find api limits for amount of appids that can be queried at once
    const query = appIDs.join(',')
    const headers = {
        method: 'GET',
        url: `https://store.steampowered.com/api/appdetails/?appids=${query}&filters=price_overview`
    }

    try {
        const response = await axios.request(headers)
        if (response.data) {
            return response.data
        } else {
            console.log("No results")
            return false
        }
    } catch (error) {
        console.error(error)
    }
}

async function getTopConcurrentPlayers() {
    const headers = {
        method: 'GET',
        url: `https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?key=${process.env.STEAM_TOKEN}`
    }

    try {
        const response = await axios.request(headers)
        if (response.data) {
            return response.data.response
        } else {
            return false
        }
    } catch (error) {
        console.error(error)
    }
}

async function getAppList(appIDs) {
    const headers = {
        method: 'GET',
        // TODO: Look into what price_change_number is (could prove to be useful for finding sales)
        url: `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${process.env.STEAM_TOKEN}&max_results=50000&include_games=true&include_software=true`
    }

    try {
        const result = []
        while (true) {
            const response = await axios.request(headers)
            if (response.data) {
                const data = response.data.response
                result.push(data.apps)
                if (!data.have_more_results) {
                    break
                }
                headers.url = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${process.env.STEAM_TOKEN}&max_results=50000&last_appid=${data.last_appid}&include_games=true&include_software=true`
            }
        }
        return result
    } catch(error) {
        console.error(error)
    }
}

module.exports = { getApp, userReviews, getUser, searchGame, getGameNews, getPlayerCount, getUserGames, searchUser, getUserBadges, getAppOverviews, getTopConcurrentPlayers, getAppList }
