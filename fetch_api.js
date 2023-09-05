const axios = require('axios');


async function get_app_raw(app_id) {

    const headers = {
        method: 'GET',
        url: `https://store.steampowered.com/api/appdetails?appids=${app_id}`
    }

    try {
        const response = await axios.request(headers);
        if (response.data[app_id].success) {
            console.log(response.data[app_id].data.name)
            return response.data[app_id].data
        } else {
            console.log("Doesn't exist")
        }
    } catch (error) {
        console.error(error);
    }

}

module.exports = { get_app_raw }

get_app_raw(1086940)