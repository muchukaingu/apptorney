# Admin Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add admin role to AppUser and build API endpoints that provide platform-wide analytics — user growth, subscriptions, revenue, content stats, AI usage, and churn.

**Architecture:** Add `role` field to AppUser model. Create a DailyStats model (replacing the existing UserStats) with a daily scheduler that snapshots all key metrics. Build admin-only REST endpoints in a single boot script that serve both live counts and time-series growth data. Add AI query counting via fire-and-forget increments in ask-ai handlers.

**Tech Stack:** LoopBack 3 (Node 8), MongoDB, node-schedule, JWT auth (existing `common/models/shared/jwt.js`)

**Design doc:** `docs/plans/2026-03-01-admin-dashboard-design.md`

---

### Task 1: Add admin role to AppUser model

**Files:**
- Modify: `common/models/appuser.json`

**Context:** The AppUser model extends LoopBack's `User` base. It already has a `hidden` array for OTP fields. We need to add a `role` property and hide it from regular REST responses.

**Step 1: Add role property and update hidden array in appuser.json**

In `common/models/appuser.json`, add the `role` property to the `properties` object:

```json
"role": {
    "type": "string",
    "default": "user"
}
```

Add `"role"` to the existing `hidden` array so it becomes:

```json
"hidden": ["otpHash", "otpExpiry", "otpAttempts", "otpLastSent", "role"]
```

**Step 2: Verify the model loads**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('AppUser props:', Object.keys(app.models.appuser.definition.properties)); process.exit(0); }, 3000)"`

Expected: Output includes `role` in the properties list.

**Step 3: Commit**

```bash
git add common/models/appuser.json
git commit -m "feat: add admin role field to AppUser model"
```

---

### Task 2: Create DailyStats model

**Files:**
- Create: `common/models/daily-stats.json`
- Create: `common/models/daily-stats.js`
- Modify: `server/model-config.json`

**Context:** There's an existing `userStats` model (registered in `server/model-config.json` at the `apptorney` datasource) that only tracks user count. We're creating a new `DailyStats` model to replace it with comprehensive metrics. The old `userStats` entry stays in model-config for now (removing it could break existing data), but all new code uses `DailyStats`.

**Step 1: Create the DailyStats model JSON**

Create `common/models/daily-stats.json`:

```json
{
    "name": "DailyStats",
    "plural": "dailyStats",
    "base": "PersistedModel",
    "idInjection": true,
    "options": {
        "validateUpsert": true
    },
    "properties": {
        "snapshotDate": {
            "type": "date",
            "required": true,
            "index": true
        },
        "totalUsers": {
            "type": "number",
            "default": 0
        },
        "newUsers": {
            "type": "number",
            "default": 0
        },
        "activeUsers": {
            "type": "number",
            "default": 0
        },
        "totalCases": {
            "type": "number",
            "default": 0
        },
        "totalLegislation": {
            "type": "number",
            "default": 0
        },
        "activeSubscriptions": {
            "type": "number",
            "default": 0
        },
        "newSubscriptions": {
            "type": "number",
            "default": 0
        },
        "churnedSubscriptions": {
            "type": "number",
            "default": 0
        },
        "totalRevenue": {
            "type": "number",
            "default": 0
        },
        "dailyRevenue": {
            "type": "number",
            "default": 0
        },
        "totalOrganizations": {
            "type": "number",
            "default": 0
        },
        "aiQueries": {
            "type": "number",
            "default": 0
        }
    },
    "validations": [],
    "relations": {},
    "acls": [
        {
            "principalType": "ROLE",
            "principalId": "$everyone",
            "permission": "DENY"
        }
    ],
    "methods": {}
}
```

**Step 2: Create the DailyStats JS file**

Create `common/models/daily-stats.js`:

```javascript
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
```

**Step 3: Register DailyStats in model-config.json**

In `server/model-config.json`, add this entry after the `userStats` entry (around line 208):

```json
"DailyStats": {
    "dataSource": "apptorney",
    "public": false
}
```

Note: `public: false` — we don't want REST endpoints auto-generated. Admin endpoints are in a boot script.

**Step 4: Verify the model loads**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('DailyStats:', !!app.models.DailyStats); process.exit(0); }, 3000)"`

Expected: `DailyStats: true`

**Step 5: Commit**

```bash
git add common/models/daily-stats.json common/models/daily-stats.js server/model-config.json
git commit -m "feat: add DailyStats model for admin dashboard metrics"
```

---

### Task 3: Update daily scheduler to snapshot all metrics

**Files:**
- Modify: `server/boot/schedule.js`

**Context:** The existing scheduler at `server/boot/schedule.js` runs daily at 17:00. It currently only counts users and writes to the old `userStats` model. We need to replace the job body to snapshot all metrics into `DailyStats`. The scheduler uses `node-schedule` which is already installed.

Important models to count:
- `app.models.appuser` or `app.models.Appuser` — users (has `createdAt` from TimeStamp mixin, `lastLogin` from auth-routes)
- `app.models.case` — cases (has `completionStatus` boolean)
- `app.models.legislation` — legislation (has `deleted` boolean)
- `app.models.subscription` — subscriptions (has `status`, `createdAt`)
- `app.models.payment` — payments (has `amount`, `status`, `date`)
- `app.models.Organization` — organizations
- `app.models.DailyStats` — where we write

**Step 1: Replace schedule.js with the new implementation**

Replace the entire contents of `server/boot/schedule.js` with:

```javascript
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

    function track(fn) {
        pending++
        fn(function (err) {
            if (err && !hasError) {
                hasError = true
                console.log('Snapshot count error:', err.message)
            }
            finished++
            if (finished === pending) {
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
```

**Step 2: Verify the server starts**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server started OK'); process.exit(0); }, 3000)"`

Expected: `Server started OK` (no crash from schedule.js loading)

**Step 3: Commit**

```bash
git add server/boot/schedule.js
git commit -m "feat: update daily scheduler to snapshot all platform metrics"
```

---

### Task 4: Add AI query counting to ask-ai handlers

**Files:**
- Modify: `server/boot/ask-ai-alias.js` (authenticated ask-ai)
- Modify: `server/boot/ask-ai-public.js` (public ask-ai)

**Context:** These boot scripts handle AI queries. We need to increment the DailyStats AI query counter each time a query is made. The `DailyStats.incrementAiQueries()` method (from Task 2) does a fire-and-forget MongoDB `$inc` — no callback needed, no response delay.

**Step 1: Add AI query counting to ask-ai-alias.js**

In `server/boot/ask-ai-alias.js`, at the top of the `handler` function (line 39), add the increment call right after verifying the user is authenticated (after the `!token || !token.userId` check at line 48-53). The increment should go just before the payload construction (line 55).

Add this line after line 53 (after the auth error return) and before line 55 (`var payload = ...`):

```javascript
                // Count AI query for admin dashboard
                var DailyStats = app.models.DailyStats
                if (DailyStats && typeof DailyStats.incrementAiQueries === 'function') {
                    DailyStats.incrementAiQueries()
                }
```

**Step 2: Add AI query counting to ask-ai-public.js**

In `server/boot/ask-ai-public.js`, add the increment at the top of the `handler` function (line 9), right after the Search model check (line 12-15). Add before the payload construction (line 17):

```javascript
        // Count AI query for admin dashboard
        var DailyStats = app.models.DailyStats
        if (DailyStats && typeof DailyStats.incrementAiQueries === 'function') {
            DailyStats.incrementAiQueries()
        }
```

**Step 3: Verify the server starts**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server started OK'); process.exit(0); }, 3000)"`

Expected: `Server started OK`

**Step 4: Commit**

```bash
git add server/boot/ask-ai-alias.js server/boot/ask-ai-public.js
git commit -m "feat: add AI query counting for admin dashboard metrics"
```

---

### Task 5: Build admin routes boot script — middleware + overview endpoint

**Files:**
- Create: `server/boot/admin-routes.js`

**Context:** This is the main admin API boot script. It mounts all admin endpoints behind a `requireAdmin` middleware that checks JWT + admin role. We build this in two tasks: this task creates the boot script skeleton, middleware, and the overview endpoint. Task 6 adds the growth and breakdown endpoints.

The middleware pattern follows the same approach as `auth-routes.js`: extract JWT via `extractBearerToken`, verify with `jwtHelper.verifyAccessToken`, then look up the user and check `role === 'admin'`.

**Step 1: Create admin-routes.js with middleware and overview endpoint**

Create `server/boot/admin-routes.js`:

```javascript
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
```

**Step 2: Verify the server starts**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server started OK'); process.exit(0); }, 3000)"`

Expected: `Server started OK`

**Step 3: Commit**

```bash
git add server/boot/admin-routes.js
git commit -m "feat: add admin middleware and overview stats endpoint"
```

---

### Task 6: Add growth time-series endpoint to admin routes

**Files:**
- Modify: `server/boot/admin-routes.js`

**Context:** This endpoint returns daily data points from the DailyStats collection, filtered by a `period` query parameter. It goes in the same boot script created in Task 5.

**Step 1: Add growth endpoint**

In `server/boot/admin-routes.js`, add the following route **before** the `sendError` helper function at the bottom:

```javascript
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
```

**Step 2: Verify the server starts**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server started OK'); process.exit(0); }, 3000)"`

Expected: `Server started OK`

**Step 3: Commit**

```bash
git add server/boot/admin-routes.js
git commit -m "feat: add growth time-series endpoint for admin dashboard"
```

---

### Task 7: Add subscription and payment breakdown endpoints

**Files:**
- Modify: `server/boot/admin-routes.js`

**Context:** Two more endpoints for detailed breakdowns. These use live MongoDB aggregation. Add them before the `sendError` helper in `admin-routes.js`.

**Step 1: Add subscription breakdown endpoint**

Add before the `sendError` helper:

```javascript
    // ── GET /api/admin/stats/subscriptions ───────────────────────────
    app.get(restRoot + '/admin/stats/subscriptions', requireAdmin, function (req, res, next) {
        var Subscription = app.models.subscription || app.models.Subscription

        Subscription.find({}, function (err, subs) {
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

        Payment.find({ order: 'date DESC' }, function (err, payments) {
            if (err) return next(err)

            for (var i = 0; i < payments.length; i++) {
                var p = payments[i]
                // Status counts
                result.byStatus[p.status] = (result.byStatus[p.status] || 0) + 1

                // Revenue (confirmed only)
                if (p.status === 'confirmed') {
                    result.totalRevenue += p.amount || 0
                    var pDate = new Date(p.date)
                    if (pDate >= startOfMonth) {
                        result.revenueThisMonth += p.amount || 0
                    } else if (pDate >= startOfLastMonth && pDate < startOfMonth) {
                        result.revenueLastMonth += p.amount || 0
                    }
                }
            }

            // Recent 20 payments
            result.recentPayments = payments.slice(0, 20).map(function (p) {
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

            res.json(result)
        })
    })
```

**Step 2: Verify the server starts**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server started OK'); process.exit(0); }, 3000)"`

Expected: `Server started OK`

**Step 3: Commit**

```bash
git add server/boot/admin-routes.js
git commit -m "feat: add subscription and payment breakdown endpoints"
```

---

### Task 8: Add content breakdown endpoint

**Files:**
- Modify: `server/boot/admin-routes.js`

**Context:** This endpoint provides case and legislation breakdowns by court, area of law, and legislation type. Uses the LoopBack `case` and `legislation` models. Cases have `court` (belongsTo), `areasOfLaw` (referencesMany), and `completionStatus`. Legislation has `legislationType` field and `deleted` flag.

For court/area breakdowns, we use MongoDB aggregation via the native connector since LoopBack 3 doesn't support `GROUP BY`.

**Step 1: Add content breakdown endpoint**

Add before the `sendError` helper:

```javascript
    // ── GET /api/admin/stats/content ─────────────────────────────────
    app.get(restRoot + '/admin/stats/content', requireAdmin, function (req, res, next) {
        var Case = app.models.case || app.models.Case
        var Legislation = app.models.legislation || app.models.Legislation
        var Court = app.models.court || app.models.Court
        var AreaOfLaw = app.models.areaOfLaw || app.models.AreaOfLaw

        var result = { cases: {}, legislation: {} }
        var pending = 0
        var finished = 0

        function track(fn) {
            pending++
            fn(function (err) {
                if (err) console.log('Content stat error:', err.message)
                finished++
                if (finished === pending) {
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
                { $match: { deleted: { $ne: true }, legislationType: { $exists: true, $ne: null, $ne: '' } } },
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
```

**Step 2: Verify the server starts**

Run: `node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server started OK'); process.exit(0); }, 3000)"`

Expected: `Server started OK`

**Step 3: Commit**

```bash
git add server/boot/admin-routes.js
git commit -m "feat: add content breakdown endpoint with court and area-of-law stats"
```

---

## Summary of all tasks

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add admin role to AppUser | `common/models/appuser.json` |
| 2 | Create DailyStats model | `common/models/daily-stats.json`, `daily-stats.js`, `server/model-config.json` |
| 3 | Update daily scheduler | `server/boot/schedule.js` |
| 4 | Add AI query counting | `server/boot/ask-ai-alias.js`, `ask-ai-public.js` |
| 5 | Admin middleware + overview endpoint | `server/boot/admin-routes.js` (create) |
| 6 | Growth time-series endpoint | `server/boot/admin-routes.js` (modify) |
| 7 | Subscription + payment breakdowns | `server/boot/admin-routes.js` (modify) |
| 8 | Content breakdown endpoint | `server/boot/admin-routes.js` (modify) |

## API endpoints created

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/stats/overview` | Admin JWT | Live platform totals |
| GET | `/api/admin/stats/growth?period=30d\|90d\|1y\|all` | Admin JWT | Daily time-series from snapshots |
| GET | `/api/admin/stats/subscriptions` | Admin JWT | Subscription breakdowns |
| GET | `/api/admin/stats/payments` | Admin JWT | Payment breakdowns + recent payments |
| GET | `/api/admin/stats/content` | Admin JWT | Cases + legislation breakdowns |
