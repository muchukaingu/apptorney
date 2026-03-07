module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var aliasPaths = [
        restRoot + '/ask-ai-public',
        restRoot + '/search/ask-ai-public',
        restRoot + '/searches/ask-ai-public'
    ]

    function handler(req, res, next) {
        var Search = app.models.search || app.models.Search

        if (!Search || typeof Search.askAiPublic !== 'function') {
            next(new Error('Search.askAiPublic is not available'))
            return
        }

        // Count AI query for admin dashboard
        var DailyStats = app.models.DailyStats
        if (DailyStats && typeof DailyStats.incrementAiQueries === 'function') {
            DailyStats.incrementAiQueries()
        }

        var payload = req.body && typeof req.body === 'object' ? Object.assign({}, req.body) : {}

        if (req.query && typeof req.query === 'object') {
            Object.keys(req.query).forEach(function (key) {
                if (payload[key] === undefined) {
                    payload[key] = req.query[key]
                }
            })
        }

        var question = payload.question || payload.queryText || payload.message || payload.prompt || payload.text || ''
        var wantsStream = payload.stream === true || payload.stream === 'true'

        if (wantsStream) {
            Search.askAiPublic(question, true, req, res, null)
            return
        }

        Search.askAiPublic(question, false, req, res, function (err, result) {
            if (err) {
                next(err)
                return
            }
            res.json(result)
        })
    }

    aliasPaths.forEach(function (path) {
        app.post(path, handler)
        app.get(path, handler)
    })
}
