/**
 * Bridge JWT auth to LoopBack's req.accessToken
 *
 * LoopBack 3 remote methods read req.accessToken.userId for authentication.
 * Our custom auth uses JWT tokens (verified via jwt.js) which set req.userId.
 * This middleware bridges the gap so LoopBack remote methods (e.g. listChatThreads)
 * can authenticate JWT users.
 *
 * Registered in the 'auth' middleware phase so it runs before route handlers.
 */
var jwtHelper = require('../../common/models/shared/jwt')

module.exports = function (app) {
    app.middleware('auth', function jwtBridge(req, res, next) {
        // Skip if LoopBack already resolved an accessToken
        if (req.accessToken) {
            return next()
        }

        var authHeader = req.headers.authorization || req.headers.Authorization
        if (!authHeader || typeof authHeader !== 'string') {
            return next()
        }

        var match = authHeader.match(/^Bearer\s+(.+)$/i)
        if (!match || !match[1]) {
            return next()
        }

        var decoded = jwtHelper.verifyAccessToken(match[1].trim())
        if (!decoded || !decoded.sub) {
            return next()
        }

        // Set req.accessToken so LoopBack remote methods see the authenticated user
        req.accessToken = { userId: decoded.sub }
        req.userId = decoded.sub
        req.userEmail = decoded.email
        next()
    })
}
