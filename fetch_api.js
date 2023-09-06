const axios = require('axios');


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

async function get_app_review_raw(app_id) {
    const headers = {
        method: 'GET',
        url: `https://store.steampowered.com/appreviews/${app_id}?cursor=*&json=1&filter=summary`
    }

    try {
        const response = await axios.request(headers);
        if (response.data.success) {
            console.log(response.data.query_summary)
            return response.data.query_summary
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

module.exports = { get_app_raw, get_app_review_raw, searchGame }
