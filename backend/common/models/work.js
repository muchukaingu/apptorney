module.exports = function(Work) {
    /**
     * Searches for Work based on mongo's $text index
     *
     * @callback {Function} cb The callback function
     */
    Work.flexisearch = function(term, cb) {
        var workCollection = Work.getDataSource().connector.collection('work');
        workCollection.updateMany({ "deleted": { "$exists": false } }, { $set: { deleted: false } });
        workCollection.createIndex({ name: "text" });
        workCollection.aggregate([
                { $match: { $and: [{ 'deleted': { $eq: !true } }, { $text: { $search: '"' + term + '"' } }] } },
                {
                    $project: {
                        score: { $meta: 'textScore' },
                        name: true
                    }
                },
                { $sort: { score: { $meta: 'textScore' }, name: -1 } }

            ],
            function(err, works) {
                // console.log(works)
                if (err) {} else {
                    cb(null, works)
                }
            })
    }


    Work.remoteMethod(
        'flexisearch', {
            http: { path: '/flexisearch', verb: 'get' },
            accepts: { arg: 'term', type: 'string' },
            returns: { arg: 'works', type: 'Object' }
        });

};