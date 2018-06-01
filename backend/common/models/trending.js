module.exports = function(Trending) {
    const { ObjectId } = require('mongodb') // or ObjectID
    var Keen = require('keen-analysis')

    // This is your actual Project ID and Write Key


    Trending.validatesUniquenessOf('sourceId', { message: 'Item already exists' })
    Trending.remoteMethod(
        'addTrend', {
            http: { path: '/addTrend', verb: 'post' },
            accepts: [
                { arg: 'sourceId', type: 'string' },
                { arg: 'type', type: 'string' }
            ],
            returns: { arg: 'trends', type: 'Object' }
        })


    Trending.remoteMethod(
            'viewTrends', {
                http: {
                    path: '/viewtrends',
                    verb: 'get'
                },
                returns: {
                    arg: 'trends',
                    type: 'Object',
                    root: true

                }
            })
        /**
         * View Trends
         * @param {String} id 
         * @callback {Function} cb The callback function
         */


    Trending.viewTrends = function(cb) {
        var keenClient = new Keen({
            projectId: '5aaf4c58c9e77c0001692b2b',
            readKey: 'FA6A891DE65E8D57C7910BCBFB6E2BA9EC60F02D568A390812E41109267B60EEB16D8B90D74E0D70480CC037E830A274517BE15DFF6403B90E17EA990F37BCD9ABD38710B80305B6DF623983A3D9EAC0F8F93391C048DA87646F832BCC520348'


        })

        keenClient
            .query('count', {
                event_collection: 'dataViews',
                group_by: 'title',
                timeframe: 'this_7_days',
                limit: 10,
                order_by: {
                    'property_name': 'result',
                    'direction': 'DESC'
                }


            })
            .then(res => {
                // Handle results
                console.log("xxx")
                cb(null, res.result)

            })
            .catch(err => {
                // Handle errors
                console.log(err)

            });


        /* keenClient
             .query('saved', 'top-views', {
                 order_by: 'result'
             })
             .then(res => {
                 // Handle response
                 console.log("xxx")
                 cb(null, res)

             })
             .catch(err => {
                 // Handle error
                 console.log(err)
             });
             */

    }






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