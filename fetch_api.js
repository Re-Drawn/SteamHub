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

async function userReviews(app_id) {
    const headers = {
        method: 'GET',
        url: `https://store.steampowered.com/appreviews/${app_id}?cursor=*&json=1&filter=summary`
    }

    try {
        const response = await axios.request(headers);
        if (response.data.success) {
            console.log(response.data.reviews[0])
            return response.data.reviews
        } else {
            console.log("Doesn't exist")
        }
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

async function getFeatured() {

    const headers = {
        method: 'GET',
        url: `https://store.steampowered.com/api/featuredcategories`
    }

    try {
        const response = await axios.request(headers);
        if (response.data.success) {
            console.log(response.data)
            return response.data
        } else {
            console.log("Search came up with no results")
        }
    } catch (error) {
        console.error(error);
    }

}

module.exports = { get_app_raw, userReviews, getUser, searchGame }
