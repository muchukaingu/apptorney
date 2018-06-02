module.exports = function(News) {
    const { ObjectId } = require('mongodb') // or ObjectID
    var d = new Date();
    var year = d.getFullYear();

    News.validatesUniquenessOf('sourceId', { message: 'News Item already exists' })
    News.remoteMethod(
        'addNews', {
            http: { path: '/addNews', verb: 'post' },
            accepts: [
                { arg: 'sourceId', type: 'string' },
                { arg: 'type', type: 'string' }
            ],
            returns: { arg: 'news', type: 'Object' }
        })


    News.remoteMethod(
        'viewNews', {
            http: {
                path: '/viewNews',
                verb: 'get'
            },
            returns: {
                arg: 'news',
                type: 'Object',
                root: true
            }
        })

    /**
     * Add Bookmarks
     * @param {String} id 
     * @callback {Function} cb The callback function
     */


    News.viewNews = function(cb) {
            var app = News.app

            var Case = app.models.Case
            var Legislation = app.models.Legislation
            var counter = 0;
            var results = [];

            function callback() {
                console.log("callback called", results.length)
                if (counter == 1) {
                    cb(null, results)
                }
                counter++;
            }


            Case.find({
                    where: { 'citation.year': year },
                    filter: {
                        fields: {
                            name: true,
                            summaryOfRuling: true,
                            id: true
                        }
                    }
                },
                function(err, cases) {

                    cases.forEach(instance => {
                        results.push({
                            title: instance.name,
                            summary: instance.summaryOfRuling,
                            sourceId: instance.id,
                            type: 'case'
                        })
                    });

                    callback()


                })

            Legislation.find({
                    where: {
                        dateOfAssent: {
                            gt: new Date(year + '-01-01T18:30:00.000Z')
                        }


                    },
                    filter: {
                        fields: {
                            legislationName: true,
                            preamble: true,
                            id: true
                        }
                    }
                },
                function(err, cases) {

                    if (cases) {
                        cases.forEach(instance => {
                            results.push({
                                title: instance.legislationName,
                                summary: instance.preamble,
                                sourceId: instance.id,
                                type: 'legislation'
                            })
                        });

                    }

                    callback()


                })

        }
        /**
         * Add Bookmarks
         * @param {String} id 
         * @callback {Function} cb The callback function
         */
    News.addNews = function(sourceId, type, cb) {
        var app = News.app
        var Case = app.models.Case
        var Legislation = app.models.Legislation
            // Case Bookmarks

        News.findOne({ where: { sourceId: sourceId } }, function(err, newsItem) {
            if (newsItem) {
                console.log(newsItem)
                News.destroyById(newsItem.id, function(err, deleted) {
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
                                var news = {
                                    title: instance.name,
                                    summary: instance.summaryOfFacts,
                                    sourceId: instance.id,
                                    type: 'case'
                                }
                                News.create(news,
                                    function(err, news) {
                                        if (err) {
                                            cb(err)
                                        } else {
                                            cb(null, news)
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
                                var news = {
                                    title: instance.legislationName,
                                    summary: instance.preamble,
                                    sourceId: instance.id,
                                    type: 'legislation'
                                }
                                News.create(news,
                                    function(err, news) {
                                        if (err) {
                                            cb(err)
                                        } else {
                                            cb(null, news)
                                        }
                                    })
                            }
                        })
                }
            }
        })
    }
}