module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var aliasPaths = [
        restRoot + '/ask-ai',
        restRoot + '/search/ask-ai',
        restRoot + '/searches/ask-ai'
    ]

    function handler(req, res, next) {
        var Search = app.models.search || app.models.Search

        if (Search && typeof Search.askAi === 'function') {
            Search.askAi(req.body || {}, function (err, result) {
                if (err) {
                    next(err)
                    return
                }
                res.json(result)
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
