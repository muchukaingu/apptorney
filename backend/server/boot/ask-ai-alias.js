module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var aliasPaths = [
        restRoot + '/ask-ai',
        restRoot + '/search/ask-ai',
        restRoot + '/searches/ask-ai'
    ]

    var jwtHelper = require('../../common/models/shared/jwt')

    function extractBearerToken(req) {
        var authHeader = req.headers && (req.headers.authorization || req.headers.Authorization)
        if (typeof authHeader === 'string') {
            var match = authHeader.match(/^Bearer\s+(.+)$/i)
            if (match && match[1]) {
                return match[1].trim()
            }
        }
        return ''
    }

    function resolveAccessToken(req, cb) {
        var token = extractBearerToken(req)
        if (!token) {
            cb(null, null)
            return
        }

        var decoded = jwtHelper.verifyAccessToken(token)
        if (!decoded) {
            cb(null, null)
            return
        }

        // Set userId on a token-like object for compatibility with handler
        cb(null, { userId: decoded.sub, email: decoded.email })
    }

    function handler(req, res, next) {
        var Search = app.models.search || app.models.Search

        if (Search && typeof Search.askAi === 'function') {
            resolveAccessToken(req, function (tokenErr, token) {
                if (tokenErr) {
                    next(tokenErr)
                    return
                }
                if (!token || !token.userId) {
                    var authErr = new Error('Authentication required')
                    authErr.statusCode = 401
                    next(authErr)
                    return
                }

                // Count AI query for admin dashboard
                var DailyStats = app.models.DailyStats
                if (DailyStats && typeof DailyStats.incrementAiQueries === 'function') {
                    DailyStats.incrementAiQueries()
                }

                var payload = req.body && typeof req.body === 'object' ? Object.assign({}, req.body) : {}

                // Also merge query params into payload (for GET requests and stream=true via query)
                if (req.query && typeof req.query === 'object') {
                    Object.keys(req.query).forEach(function (key) {
                        if (key !== 'access_token' && payload[key] === undefined) {
                            payload[key] = req.query[key]
                        }
                    })
                }

                // SSE streaming path
                var wantsStream = payload.stream === true || payload.stream === 'true'
                if (wantsStream && typeof Search.askAiStream === 'function') {
                    Search.askAiStream(payload, req, res)
                    return
                }

                function encodeIfArray(value) {
                    return Array.isArray(value) ? JSON.stringify(value) : undefined
                }

                Search.askAi(
                    payload.question,
                    payload.queryText,
                    payload.message,
                    payload.prompt,
                    payload.text,
                    payload.threadId,
                    payload.retrievalLimit,
                    payload.maxCandidates,
                    payload.includeCases,
                    payload.includeLegislations,
                    payload.includeDeleted,
                    payload.model,
                    payload.temperature,
                    payload.maxTokens,
                    payload.title,
                    payload.maxHistoryMessages,
                    payload.queryVector,
                    payload.historyJson || encodeIfArray(payload.history),
                    payload.messagesJson || encodeIfArray(payload.messages),
                    payload.chatHistoryJson || encodeIfArray(payload.chatHistory),
                    payload.conversationJson || encodeIfArray(payload.conversation),
                    req,
                    function (err, result) {
                        if (err) {
                            next(err)
                            return
                        }
                        res.json(result)
                    }
                )
            })
            return
        }

        // Fallback to the generated remote endpoint if the method is exposed there.
        req.url = restRoot + '/searches/ask-ai'
        var restHandler = app.handler('rest')
        if (!restHandler) {
            next(new Error('Search.askAi is not available'))
            return
        }
        restHandler(req, res, function (err) {
            if (err) {
                next(err)
                return
            }
            if (!res.headersSent) {
                next(new Error('Search.askAi is not available'))
            }
        })
    }

    aliasPaths.forEach(function (path) {
        app.post(path, handler)
        app.get(path, handler)
    })
}
