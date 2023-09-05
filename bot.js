const { get_app_raw } = require('./fetch_api.js')

const app_raw = get_app_raw(440)

function format_data(raw) {
    console.log(raw.name)
    console.log(raw.is_free)
}


//format_data(app_raw)