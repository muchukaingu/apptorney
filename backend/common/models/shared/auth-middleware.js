var jwtHelper = require('./jwt')

module.exports.requireAuth = function (req, res, next) {
    var authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: { statusCode: 401, message: 'Authentication required' }
        })
    }

    var token = authHeader.split(' ')[1]
    var decoded = jwtHelper.verifyAccessToken(token)
    if (!decoded) {
        return res.status(401).json({
            error: { statusCode: 401, message: 'Invalid or expired token' }
        })
    }

    req.userId = decoded.sub
    req.userEmail = decoded.email
    next()
}
