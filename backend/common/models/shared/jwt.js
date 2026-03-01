var jwt = require('jsonwebtoken')

var SECRET = process.env.JWT_SECRET || 'apptorney-jwt-secret-change-in-production'
var ACCESS_TOKEN_EXPIRY = '15m'
var REFRESH_TOKEN_EXPIRY = '30d'

module.exports.signAccessToken = function (userId, email) {
    return jwt.sign(
        { sub: String(userId), email: email, type: 'access' },
        SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
}

module.exports.signRefreshToken = function (userId) {
    return jwt.sign(
        { sub: String(userId), type: 'refresh' },
        SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    )
}

module.exports.verifyAccessToken = function (token) {
    try {
        var decoded = jwt.verify(token, SECRET)
        if (decoded.type !== 'access') {
            return null
        }
        return decoded
    } catch (err) {
        return null
    }
}

module.exports.verifyRefreshToken = function (token) {
    try {
        var decoded = jwt.verify(token, SECRET)
        if (decoded.type !== 'refresh') {
            return null
        }
        return decoded
    } catch (err) {
        return null
    }
}
