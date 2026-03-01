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
            {
                $inc: { aiQueries: 1 },
                $setOnInsert: {
                    totalUsers: 0, newUsers: 0, activeUsers: 0,
                    totalCases: 0, totalLegislation: 0,
                    activeSubscriptions: 0, newSubscriptions: 0,
                    churnedSubscriptions: 0, totalRevenue: 0,
                    dailyRevenue: 0, totalOrganizations: 0
                }
            },
            { upsert: true },
            function (err) {
                if (cb) cb(err)
            }
        )
    }
}
