'use strict'

module.exports = function (DailyStats) {
    // Increment today's AI query counter (fire-and-forget)
    DailyStats.incrementAiQueries = function (cb) {
        var today = new Date()
        today.setHours(0, 0, 0, 0)

        var connector = DailyStats.getDataSource().connector
        var collection = connector.collection(DailyStats.modelName)

        collection.updateOne(
            { snapshotDate: today },
            { $inc: { aiQueries: 1 } },
            { upsert: true },
            function (err) {
                if (cb) cb(err)
            }
        )
    }
}
