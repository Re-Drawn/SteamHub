const axios = require('axios')
const { JSDOM } = require('jsdom')
require('dotenv').config()


async function get_app_raw(app_id) {

    const headers = {
        method: 'GET',
        url: `https://store.steampowered.com/api/appdetails?appids=${app_id}&cc=US`
    }

    try {
        const response = await axios.request(headers);
        if (response.data[app_id].success) {
            //console.log(response.data[app_id].data)
            return response.data[app_id].data
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
    }

}

async function findUser(username) {
    // Get a session ID to make AJAX request later
    const headers = {
        url: 'https://steamcommunity.com/'
    }

    let sessionID = null

    try {
        const response = await axios.request(headers)
        // TODO: Find better way to get sessionID from headers
        sessionID = response.headers['set-cookie'][0].split('=').join(";").split(';')[1]
        console.log(sessionID)
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
            const response = await axios.request(headers)
            if (response.data.success) {
                // Create HTML parser to get users from response HTML
                const parser = new JSDOM(response.data.html).window.document
                for (let i = 0; i < (Math.min(response.data.search_result_count, 20)); i++) {
                    console.log(parser.getElementsByClassName("searchPersonaName").item(i).textContent)
                } 
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { get_app_raw, userReviews, getUser, searchGame, getPlayerCount }
