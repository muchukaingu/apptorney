module.exports = function(CaseWorks) {
    /**
     * Lists all duplicated cases with the number of duplicate occurences
     *
     * @callback {Function} cb The callback function
     */
    CaseWorks.getDuplicates = function(cb) {
        var collection = CaseWorks.getDataSource().connector.collection('caseWorks')
        collection.aggregate([{
                    '$group': {
                        '_id': { 'caseId': '$caseId', 'workId': '$workId' },
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

    CaseWorks.remoteMethod(
        'getDuplicates', {
            http: { path: '/duplicates', verb: 'get' },
            accepts: [],
            returns: [
                { arg: 'duplicates', type: 'Object' },
                { arg: 'uniqueCount', type: 'Object' }
            ]
        })
}