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

        function track(fn) {
            pending++
            fn(function (err) {
                if (err) console.log('Overview stat error:', err.message)
                finished++
                if (finished === pending) {
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

    // ── Helper ───────────────────────────────────────────────────────
    function sendError(res, statusCode, message) {
        res.status(statusCode).json({
            error: { statusCode: statusCode, message: message }
        })
    }
}
