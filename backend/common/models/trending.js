module.exports = function(Trending) {
    const { ObjectId } = require('mongodb') // or ObjectID

    Trending.remoteMethod(
        'addTrend', {
            http: { path: '/addTrend', verb: 'post' },
            accepts: [
                { arg: 'sourceId', type: 'string' },
                { arg: 'type', type: 'string' }
            ],
            returns: { arg: 'trends', type: 'Object' }
        })

    /**
     * Add Bookmarks
     * @param {String} id 
     * @callback {Function} cb The callback function
     */
    Trending.addTrend = function(sourceId, type, cb) {
        var app = Trending.app
        var Case = app.models.Case
        var Legislation = app.models.Legislation
            // Case Bookmarks

        Trending.findOne({ where: { sourceId: sourceId } }, function(err, trend) {
            console.log('The fucking ID is', trend)
            console.log('The fucking err is', err)
            if (trend) {
                console.log(trend)
                Trending.destroyById(trend.id, function(err, deleted) {
                    console.log(err, deleted)
                    cb(err, deleted)
                })
            } else {
                if (type == 'case') {
                    Case.findOne({ where: { id: ObjectId(sourceId) } },
                        function(err, instance) {
                            if (instance == null) {
                                console.log('case not found', sourceId)
                                cb(err, null)
                            } else {
                                var trends = {
                                    title: instance.name,
                                    summary: instance.summaryOfFacts,
                                    sourceId: instance.id,
                                    type: 'case'
                                }
                                Trending.create(trends,
                                    function(err, trends) {
                                        if (err) {
                                            cb(err)
                                        } else {
                                            cb(null, trends)
                                        }
                                    })
                            }
                        })
                } else if (type == 'legislation') {
                    Legislation.findOne({ where: { id: ObjectId(sourceId) } },
                        function(err, instance) {
                            if (instance == null) {
                                console.log('legislation not found', sourceId)
                                cb(err, null)
                            } else {
                                var trends = {
                                    title: instance.legislationName,
                                    summary: instance.preamble,
                                    sourceId: instance.id,
                                    type: 'legislation'
                                }
                                Trending.create(trends,
                                    function(err, trends) {
                                        if (err) {
                                            cb(err)
                                        } else {
                                            cb(null, trends)
                                        }
                                    })
                            }
                        })
                }
            }
        })
    }
}