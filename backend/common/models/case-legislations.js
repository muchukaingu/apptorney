module.exports = function(CaseLegislations) {

    /**
     * Lists all duplicated cases with the number of duplicate occurences
     *
     * @callback {Function} cb The callback function
     */
    CaseLegislations.getDuplicates = function(cb) {
        var collection = CaseLegislations.getDataSource().connector.collection('caseLegislations')
        collection.aggregate([{
                    '$group': {
                        '_id': { 'caseId': '$caseId', 'legislationId': '$legislationId' },
                        'uniqueIds': { '$addToSet': '$_id' },
                        'count': { '$sum': 1 }
                    }
                },
                { '$match': { 'count': { '$gt': 1 } } }
            ],
            function(err, refs) {
                if (err) {
                    console.log(err)
                } else {
                    var toDelete = []
                    console.log(refs.length)

                    refs.forEach(function(refInstance) {
                        for (var i = 0; i < refInstance.uniqueIds.length; i++) {
                            if (i > 0) {
                                toDelete.push(refInstance.uniqueIds[i])
                                collection.remove({ _id: refInstance.uniqueIds[i] })
                            }
                        }

                        refInstance.fields = refInstance._id
                        delete refInstance['_id']
                    })
                    cb(null, toDelete.length)
                }
            })
    }

    CaseLegislations.remoteMethod(
        'getDuplicates', {
            http: { path: '/duplicates', verb: 'get' },
            accepts: [],
            returns: [
                { arg: 'duplicates', type: 'Object' },
                { arg: 'uniqueCount', type: 'Object' }
            ]
        })
}