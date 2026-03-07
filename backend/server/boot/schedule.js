'use strict'

module.exports = function scheduleMetricsSnapshot(app) {
    var schedule = require('node-schedule')
    var rule = new schedule.RecurrenceRule()
    rule.hour = 17
    rule.minute = 0

    schedule.scheduleJob(rule, function () {
        console.log('Daily metrics snapshot starting')
        captureSnapshot(app, function (err) {
            if (err) {
                console.log('Daily metrics snapshot error:', err.message)
            } else {
                console.log('Daily metrics snapshot complete')
            }
        })
    })
}

function captureSnapshot(app, done) {
    var DailyStats = app.models.DailyStats
    var Appuser = app.models.appuser || app.models.Appuser
    var Case = app.models.case || app.models.Case
    var Legislation = app.models.legislation || app.models.Legislation
    var Subscription = app.models.subscription || app.models.Subscription
    var Payment = app.models.payment || app.models.Payment
    var Organization = app.models.Organization

    var today = new Date()
    today.setHours(0, 0, 0, 0)
    var thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    var entry = { snapshotDate: today }
    var pending = 0
    var finished = 0
    var hasError = false
    var saving = false

    function track(fn) {
        pending++
        fn(function (err) {
            if (err && !hasError) {
                hasError = true
                console.log('Snapshot count error:', err.message)
            }
            finished++
            if (!saving && finished === pending) {
                saving = true
                saveSnapshot()
            }
        })
    }

    function saveSnapshot() {
        // Upsert: update today's record or create it
        DailyStats.findOne({ where: { snapshotDate: today } }, function (err, existing) {
            if (err) return done(err)

            // Preserve aiQueries count that was incremented throughout the day
            if (existing) {
                entry.aiQueries = existing.aiQueries || 0
                existing.updateAttributes(entry, done)
            } else {
                entry.aiQueries = 0
                DailyStats.create(entry, done)
            }
        })
    }

    // Total users
    track(function (cb) {
        Appuser.count({}, function (err, count) {
            if (!err) entry.totalUsers = count || 0
            cb(err)
        })
    })

    // New users today
    track(function (cb) {
        Appuser.count({ createdAt: { gte: today } }, function (err, count) {
            if (!err) entry.newUsers = count || 0
            cb(err)
        })
    })

    // Active users (logged in within last 30 days)
    track(function (cb) {
        Appuser.count({ lastLogin: { gte: thirtyDaysAgo } }, function (err, count) {
            if (!err) entry.activeUsers = count || 0
            cb(err)
        })
    })

    // Total cases
    track(function (cb) {
        Case.count({}, function (err, count) {
            if (!err) entry.totalCases = count || 0
            cb(err)
        })
    })

    // Total legislation (not deleted)
    track(function (cb) {
        Legislation.count({ deleted: { neq: true } }, function (err, count) {
            if (!err) entry.totalLegislation = count || 0
            cb(err)
        })
    })

    // Active subscriptions
    track(function (cb) {
        Subscription.count({ status: 'active' }, function (err, count) {
            if (!err) entry.activeSubscriptions = count || 0
            cb(err)
        })
    })

    // New subscriptions today
    track(function (cb) {
        Subscription.count({ createdAt: { gte: today } }, function (err, count) {
            if (!err) entry.newSubscriptions = count || 0
            cb(err)
        })
    })

    // Churned subscriptions today (expired or cancelled with updatedAt today)
    track(function (cb) {
        Subscription.count({
            status: { inq: ['expired', 'cancelled'] },
            updatedAt: { gte: today }
        }, function (err, count) {
            if (!err) entry.churnedSubscriptions = count || 0
            cb(err)
        })
    })

    // Total revenue (sum of confirmed payments)
    track(function (cb) {
        Payment.find({ where: { status: 'confirmed' }, fields: { amount: true } }, function (err, payments) {
            if (!err) {
                entry.totalRevenue = 0
                for (var i = 0; i < (payments || []).length; i++) {
                    entry.totalRevenue += payments[i].amount || 0
                }
            }
            cb(err)
        })
    })

    // Daily revenue (confirmed payments today)
    track(function (cb) {
        Payment.find({
            where: { status: 'confirmed', date: { gte: today } },
            fields: { amount: true }
        }, function (err, payments) {
            if (!err) {
                entry.dailyRevenue = 0
                for (var i = 0; i < (payments || []).length; i++) {
                    entry.dailyRevenue += payments[i].amount || 0
                }
            }
            cb(err)
        })
    })

    // Total organizations
    track(function (cb) {
        Organization.count({}, function (err, count) {
            if (!err) entry.totalOrganizations = count || 0
            cb(err)
        })
    })
}
