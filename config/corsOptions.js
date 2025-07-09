const allowOrigins = require('./allowOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowd by CORS'))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOptions