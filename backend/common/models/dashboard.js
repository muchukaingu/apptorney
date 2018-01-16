// var utils = require('../node_modules/loopback/lib/utils')

module.exports = function(Dashboard) {
    Dashboard.remoteMethod(
        'summary', {
            http: { path: '/summary', verb: 'get' },
            returns: { arg: 'summary', type: 'Object' }
        })

    Dashboard.summary = function(cb) {
        var app = Dashboard.app
        var Legislation = app.models.legislation
        var Case = app.models.case
        var summary = {}
        var callbackCalls = 0

        function callback(err, data) {
            if (callbackCalls == 6) {
                cb(err, data)
            }
            callbackCalls++
        }

        Case.count({ deleted: { neq: true } }, function(err, count) {
            summary.totalCases = count
            callback(null, summary)
        })

        Case.count({ deleted: { neq: false } }, function(err, count) {
            summary.totalDeletedCases = count
            callback(null, summary)
        })

        Case.count({
            and: [{ deleted: { neq: true } }, { primaryReview: { neq: false } }]
        }, function(err, count) {
            summary.primaryReview = count
            callback(null, summary)
        })

        Case.count({
            and: [{ deleted: { neq: true } }, { secondaryReview: { neq: false } }]
        }, function(err, count) {
            summary.secondaryReview = count
            callback(null, summary)
        })

        Case.count({
            and: [{ deleted: { neq: true } }, { completionStatus: { neq: true } }]
        }, function(err, count) {
            summary.incompleteCases = count
            callback(null, summary)
        })

        Case.count({
            and: [{ deleted: { neq: true } }, { completionStatus: { neq: false } }]
        }, function(err, count) {
            summary.completeCases = count
            callback(null, summary)
        })

        Case.count({
            and: [{ deleted: { neq: true } }, { isStub: { neq: false } }]
        }, function(err, count) {
            summary.caseStubs = count
            callback(null, summary)
        })

        // Legislation.find({ deleted: { neq: true } }, function(err, legislations) {
        //     var incomplete = []
        //     var complete = 0
        //     legislations.forEach(function(legislation) {
        //         if (legislation.completionStatus == true) {
        //             complete += 1
        //         }
        //     })
        //     summary.totalLegislations = legislations.length
        //     summary.completedLegislations = complete
        //     summary.incompleteLegislations = summary.totalLegislations - summary.completedLegislations
        //     callback(null, summary)
        // })
    }
}