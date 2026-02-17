module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var aliasPaths = [
        restRoot + '/ask-ai',
        restRoot + '/search/ask-ai',
        restRoot + '/searches/ask-ai'
    ]

    function extractTokenId(req) {
        if (req.accessToken && req.accessToken.id) {
            return String(req.accessToken.id)
        }

        if (req.query && typeof req.query.access_token === 'string' && req.query.access_token.trim()) {
            return req.query.access_token.trim()
        }

        if (req.body && typeof req.body.access_token === 'string' && req.body.access_token.trim()) {
            return req.body.access_token.trim()
        }

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
        if (req.accessToken && req.accessToken.userId) {
            cb(null, req.accessToken)
            return
        }

        var tokenId = extractTokenId(req)
        if (!tokenId) {
            cb(null, null)
            return
        }

        var AccessToken = app.models.AccessToken
        if (!AccessToken || typeof AccessToken.findById !== 'function') {
            cb(new Error('AccessToken model is not available'))
            return
        }

        AccessToken.findById(tokenId, function (err, token) {
            if (err) {
                cb(err)
                return
            }
            if (!token) {
                cb(null, null)
                return
            }

            if (typeof token.validate === 'function') {
                token.validate(function (validateErr, isValid) {
                    if (validateErr) {
                        cb(validateErr)
                        return
                    }
                    if (!isValid) {
                        cb(null, null)
                        return
                    }
                    req.accessToken = token
                    cb(null, token)
                })
                return
            }

            req.accessToken = token
            cb(null, token)
        })
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

                var payload = req.body && typeof req.body === 'object' ? Object.assign({}, req.body) : {}
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
    })
}
