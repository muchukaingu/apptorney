'use strict'

var jwtHelper = require('../../common/models/shared/jwt')

module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'

    // ── Admin middleware ─────────────────────────────────────────────
    function requireAdmin(req, res, next) {
        var authHeader = req.headers && (req.headers.authorization || req.headers.Authorization)
        var token = ''
        if (typeof authHeader === 'string') {
            var match = authHeader.match(/^Bearer\s+(.+)$/i)
            if (match && match[1]) token = match[1].trim()
        }

        if (!token) {
            return sendError(res, 401, 'Authentication required')
        }

        var decoded = jwtHelper.verifyAccessToken(token)
        if (!decoded) {
            return sendError(res, 401, 'Invalid or expired token')
        }

        var Appuser = app.models.appuser || app.models.Appuser
        Appuser.findById(decoded.sub, function (err, user) {
            if (err) return next(err)
            if (!user) {
                return sendError(res, 401, 'User not found')
            }
            if (user.role !== 'admin') {
                return sendError(res, 403, 'Admin access required')
            }
            req.adminUser = user
            next()
        })
    }

    // ── GET /api/admin/stats/overview ────────────────────────────────
    app.get(restRoot + '/admin/stats/overview', requireAdmin, function (req, res, next) {
        var Appuser = app.models.appuser || app.models.Appuser
        var Case = app.models.case || app.models.Case
        var Legislation = app.models.legislation || app.models.Legislation
        var Subscription = app.models.subscription || app.models.Subscription
        var Payment = app.models.payment || app.models.Payment
        var Organization = app.models.Organization
        var DailyStats = app.models.DailyStats

        var now = new Date()
        var today = new Date(now)
        today.setHours(0, 0, 0, 0)
        var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        var thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        var result = {
            users: {},
            content: {},
            subscriptions: {},
            revenue: {},
            organizations: {},
            ai: {}
        }

        var pending = 0
        var finished = 0
        var sent = false

        function track(fn) {
            pending++
            fn(function (err) {
                if (err) console.log('Overview stat error:', err.message)
                finished++
                if (!sent && finished === pending) {
                    sent = true
                    res.json(result)
                }
            })
        }

        // Users
        track(function (cb) {
            Appuser.count({}, function (err, count) {
                result.users.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Appuser.count({ lastLogin: { gte: thirtyDaysAgo } }, function (err, count) {
                result.users.active = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Appuser.count({ createdAt: { gte: today } }, function (err, count) {
                result.users.newToday = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Appuser.count({ createdAt: { gte: startOfMonth } }, function (err, count) {
                result.users.newThisMonth = count || 0
                cb(err)
            })
        })

        // Content
        track(function (cb) {
            Case.count({}, function (err, count) {
                result.content.totalCases = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: true }, function (err, count) {
                result.content.completeCases = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: { neq: true } }, function (err, count) {
                result.content.incompleteCases = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Legislation.count({ deleted: { neq: true } }, function (err, count) {
                result.content.totalLegislation = count || 0
                cb(err)
            })
        })

        // Subscriptions
        track(function (cb) {
            Subscription.count({}, function (err, count) {
                result.subscriptions.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'active' }, function (err, count) {
                result.subscriptions.active = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'expired' }, function (err, count) {
                result.subscriptions.expired = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'cancelled' }, function (err, count) {
                result.subscriptions.cancelled = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Subscription.count({ status: 'pending' }, function (err, count) {
                result.subscriptions.pending = count || 0
                cb(err)
            })
        })

        // Revenue
        track(function (cb) {
            Payment.find({ where: { status: 'confirmed' }, fields: { amount: true } }, function (err, payments) {
                result.revenue.total = 0
                for (var i = 0; i < (payments || []).length; i++) {
                    result.revenue.total += payments[i].amount || 0
                }
                cb(err)
            })
        })

        track(function (cb) {
            Payment.find({
                where: { status: 'confirmed', date: { gte: startOfMonth } },
                fields: { amount: true }
            }, function (err, payments) {
                result.revenue.thisMonth = 0
                for (var i = 0; i < (payments || []).length; i++) {
                    result.revenue.thisMonth += payments[i].amount || 0
                }
                cb(err)
            })
        })

        // Organizations
        track(function (cb) {
            Organization.count({}, function (err, count) {
                result.organizations.total = count || 0
                cb(err)
            })
        })

        // AI queries today
        track(function (cb) {
            DailyStats.findOne({ where: { snapshotDate: today } }, function (err, stats) {
                result.ai.queriesToday = (stats && stats.aiQueries) || 0
                cb(err)
            })
        })
    })

    // ── GET /api/admin/stats/growth ──────────────────────────────────
    app.get(restRoot + '/admin/stats/growth', requireAdmin, function (req, res, next) {
        var DailyStats = app.models.DailyStats
        var period = req.query.period || '30d'

        var now = new Date()
        var since

        if (period === '90d') {
            since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        } else if (period === '1y') {
            since = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        } else if (period === 'all') {
            since = new Date(0)
        } else if (period === '30d') {
            since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        } else {
            return sendError(res, 400, 'Invalid period. Use 30d, 90d, 1y, or all.')
        }

        DailyStats.find({
            where: { snapshotDate: { gte: since } },
            order: 'snapshotDate ASC'
        }, function (err, snapshots) {
            if (err) return next(err)

            var dataPoints = []
            for (var i = 0; i < snapshots.length; i++) {
                var s = snapshots[i]
                dataPoints.push({
                    date: s.snapshotDate,
                    totalUsers: s.totalUsers || 0,
                    newUsers: s.newUsers || 0,
                    activeUsers: s.activeUsers || 0,
                    activeSubscriptions: s.activeSubscriptions || 0,
                    newSubscriptions: s.newSubscriptions || 0,
                    churnedSubscriptions: s.churnedSubscriptions || 0,
                    totalRevenue: s.totalRevenue || 0,
                    dailyRevenue: s.dailyRevenue || 0,
                    aiQueries: s.aiQueries || 0
                })
            }

            res.json({ period: period, dataPoints: dataPoints })
        })
    })

    // ── GET /api/admin/stats/subscriptions ───────────────────────────
    app.get(restRoot + '/admin/stats/subscriptions', requireAdmin, function (req, res, next) {
        var Subscription = app.models.subscription || app.models.Subscription

        Subscription.find({ fields: { plan: true, billingPeriod: true, status: true, type: true } }, function (err, subs) {
            if (err) return next(err)

            var byPlan = {}
            var byBillingPeriod = {}
            var byStatus = {}
            var byType = {}

            for (var i = 0; i < subs.length; i++) {
                var s = subs[i]
                byPlan[s.plan] = (byPlan[s.plan] || 0) + 1
                byBillingPeriod[s.billingPeriod] = (byBillingPeriod[s.billingPeriod] || 0) + 1
                byStatus[s.status] = (byStatus[s.status] || 0) + 1
                byType[s.type] = (byType[s.type] || 0) + 1
            }

            res.json({
                byPlan: byPlan,
                byBillingPeriod: byBillingPeriod,
                byStatus: byStatus,
                byType: byType
            })
        })
    })

    // ── GET /api/admin/stats/payments ────────────────────────────────
    app.get(restRoot + '/admin/stats/payments', requireAdmin, function (req, res, next) {
        var Payment = app.models.payment || app.models.Payment

        var now = new Date()
        var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        var startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        var result = {
            byStatus: {},
            recentPayments: [],
            totalRevenue: 0,
            revenueThisMonth: 0,
            revenueLastMonth: 0
        }

        var pending2 = 2
        var finished2 = 0
        var sent2 = false

        function done2() {
            finished2++
            if (!sent2 && finished2 === pending2) {
                sent2 = true
                res.json(result)
            }
        }

        // Revenue aggregation — only load amount and date fields for confirmed payments
        Payment.find({
            where: { status: 'confirmed' },
            fields: { amount: true, date: true }
        }, function (err, confirmed) {
            if (err) return next(err)

            for (var i = 0; i < confirmed.length; i++) {
                var p = confirmed[i]
                result.totalRevenue += p.amount || 0
                var pDate = new Date(p.date)
                if (pDate >= startOfMonth) {
                    result.revenueThisMonth += p.amount || 0
                } else if (pDate >= startOfLastMonth && pDate < startOfMonth) {
                    result.revenueLastMonth += p.amount || 0
                }
            }

            // Status counts from confirmed
            result.byStatus.confirmed = confirmed.length
            done2()
        })

        // Recent 20 payments + non-confirmed status counts
        Payment.find({
            where: { status: { neq: 'confirmed' } },
            fields: { status: true }
        }, function (err, others) {
            if (err) return next(err)

            for (var i = 0; i < others.length; i++) {
                var status = others[i].status
                result.byStatus[status] = (result.byStatus[status] || 0) + 1
            }

            // Get recent 20 across all statuses
            Payment.find({
                order: 'date DESC',
                limit: 20,
                fields: { id: true, date: true, amount: true, method: true, status: true, reference: true, subscriptionId: true }
            }, function (err2, recent) {
                if (err2) return next(err2)

                result.recentPayments = recent.map(function (p) {
                    return {
                        id: p.id,
                        date: p.date,
                        amount: p.amount,
                        method: p.method,
                        status: p.status,
                        reference: p.reference,
                        subscriptionId: p.subscriptionId
                    }
                })
                done2()
            })
        })
    })

    // ── GET /api/admin/stats/content ─────────────────────────────────
    app.get(restRoot + '/admin/stats/content', requireAdmin, function (req, res, next) {
        var Case = app.models.case || app.models.Case
        var Legislation = app.models.legislation || app.models.Legislation
        var Court = app.models.court || app.models.Court
        var AreaOfLaw = app.models.areaOfLaw || app.models.AreaOfLaw

        var result = { cases: {}, legislation: {} }
        var pending = 0
        var finished = 0
        var sent = false

        function track(fn) {
            pending++
            fn(function (err) {
                if (err) console.log('Content stat error:', err.message)
                finished++
                if (!sent && finished === pending) {
                    sent = true
                    res.json(result)
                }
            })
        }

        // Case totals
        track(function (cb) {
            Case.count({}, function (err, count) {
                result.cases.total = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: true }, function (err, count) {
                result.cases.complete = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ completionStatus: { neq: true } }, function (err, count) {
                result.cases.incomplete = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ primaryReview: true }, function (err, count) {
                result.cases.verified = count || 0
                cb(err)
            })
        })

        track(function (cb) {
            Case.count({ isStub: true }, function (err, count) {
                result.cases.stubs = count || 0
                cb(err)
            })
        })

        // Cases by court (top 10)
        track(function (cb) {
            var connector = Case.getDataSource().connector
            var collection = connector.collection(Case.modelName)

            collection.aggregate([
                { $match: { courtId: { $exists: true, $ne: null } } },
                { $group: { _id: '$courtId', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]).toArray(function (err, groups) {
                if (err) return cb(err)

                if (!groups || groups.length === 0) {
                    result.cases.byCourt = []
                    return cb(null)
                }

                var courtIds = groups.map(function (g) { return g._id })
                Court.find({ where: { id: { inq: courtIds } } }, function (courtErr, courts) {
                    if (courtErr) return cb(courtErr)

                    var courtMap = {}
                    for (var i = 0; i < courts.length; i++) {
                        courtMap[String(courts[i].id)] = courts[i].name
                    }

                    result.cases.byCourt = groups.map(function (g) {
                        return { name: courtMap[String(g._id)] || 'Unknown', count: g.count }
                    })
                    cb(null)
                })
            })
        })

        // Cases by area of law (top 10)
        track(function (cb) {
            var connector = Case.getDataSource().connector
            var collection = connector.collection(Case.modelName)

            collection.aggregate([
                { $match: { areasOfLawIds: { $exists: true, $ne: [] } } },
                { $unwind: '$areasOfLawIds' },
                { $group: { _id: '$areasOfLawIds', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]).toArray(function (err, groups) {
                if (err) return cb(err)

                if (!groups || groups.length === 0) {
                    result.cases.byAreaOfLaw = []
                    return cb(null)
                }

                var areaIds = groups.map(function (g) { return g._id })
                AreaOfLaw.find({ where: { id: { inq: areaIds } } }, function (areaErr, areas) {
                    if (areaErr) return cb(areaErr)

                    var areaMap = {}
                    for (var i = 0; i < areas.length; i++) {
                        areaMap[String(areas[i].id)] = areas[i].name
                    }

                    result.cases.byAreaOfLaw = groups.map(function (g) {
                        return { name: areaMap[String(g._id)] || 'Unknown', count: g.count }
                    })
                    cb(null)
                })
            })
        })

        // Legislation totals
        track(function (cb) {
            Legislation.count({ deleted: { neq: true } }, function (err, count) {
                result.legislation.total = count || 0
                cb(err)
            })
        })

        // Legislation by type (top 10)
        track(function (cb) {
            var connector = Legislation.getDataSource().connector
            var collection = connector.collection(Legislation.modelName)

            collection.aggregate([
                { $match: { deleted: { $ne: true }, legislationType: { $exists: true, $nin: [null, ''] } } },
                { $group: { _id: '$legislationType', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]).toArray(function (err, groups) {
                if (err) return cb(err)

                result.legislation.byType = (groups || []).map(function (g) {
                    return { name: g._id || 'Unknown', count: g.count }
                })
                cb(null)
            })
        })
    })

    // ── Helper ───────────────────────────────────────────────────────
    function sendError(res, statusCode, message) {
        res.status(statusCode).json({
            error: { statusCode: statusCode, message: message }
        })
    }
}
