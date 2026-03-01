# Admin Dashboard Design

**Goal:** Add an admin role system and API endpoints that provide platform-wide analytics — user growth, subscription/revenue tracking, content stats, AI usage, and churn.

**Architecture:** Role field on AppUser with admin middleware protecting dedicated admin API endpoints. Hybrid approach: live MongoDB counts for current totals, daily snapshots (DailyStats model) for growth time series. Extends the existing daily scheduler in schedule.js.

---

## 1. Admin Role

- Add `role` field to AppUser model: `{ "type": "string", "default": "user" }` — values: `"user"`, `"admin"`
- Add `role` to the `hidden` array so it's not exposed in regular REST responses
- `requireAdmin` middleware: extracts JWT from Authorization header, verifies it, looks up user, checks `role === "admin"`. Returns 403 if not admin.
- Initial admin users set via direct DB update or a bootstrap mechanism
- Future: admin-only endpoint to promote/demote users

## 2. Admin API Endpoints

All endpoints mounted at `GET /api/admin/...` in a new `server/boot/admin-routes.js` boot script. All require admin JWT.

### 2.1 Overview Stats (Live Counts)

`GET /api/admin/stats/overview`

Returns current platform totals computed live from MongoDB:

```json
{
  "users": {
    "total": 1250,
    "active": 890,
    "newToday": 12,
    "newThisMonth": 145
  },
  "content": {
    "totalCases": 5400,
    "completeCases": 4800,
    "incompleteCases": 600,
    "totalLegislation": 1200
  },
  "subscriptions": {
    "total": 320,
    "active": 280,
    "expired": 30,
    "cancelled": 10,
    "pending": 0
  },
  "revenue": {
    "total": 156000,
    "thisMonth": 12500
  },
  "organizations": {
    "total": 45
  },
  "ai": {
    "queriesToday": 342
  }
}
```

- `active` users = users with `lastLogin` within the last 30 days
- `newToday` / `newThisMonth` = users with `createdAt` in the relevant period
- Revenue computed from Payment records with `status: "confirmed"`
- AI queries today counted from DailyStats for today's date (or a simple counter)

### 2.2 Growth Time Series (Daily Snapshots)

`GET /api/admin/stats/growth?period=30d|90d|1y|all`

Returns daily data points from DailyStats collection:

```json
{
  "period": "30d",
  "dataPoints": [
    {
      "date": "2026-02-01",
      "totalUsers": 1100,
      "newUsers": 8,
      "activeUsers": 800,
      "activeSubscriptions": 250,
      "newSubscriptions": 3,
      "churnedSubscriptions": 1,
      "totalRevenue": 143500,
      "dailyRevenue": 500,
      "aiQueries": 280
    }
  ]
}
```

Period mapping:
- `30d` — last 30 days
- `90d` — last 90 days
- `1y` — last 365 days
- `all` — all available data

### 2.3 Subscription Breakdown (Live Aggregation)

`GET /api/admin/stats/subscriptions`

```json
{
  "byPlan": {
    "b2c_standard": 200,
    "b2b_per_user": 120
  },
  "byBillingPeriod": {
    "monthly": 180,
    "annual": 140
  },
  "byStatus": {
    "active": 280,
    "pending": 0,
    "expired": 30,
    "cancelled": 10
  },
  "byType": {
    "individual": 200,
    "organization": 120
  }
}
```

### 2.4 Payment Breakdown (Live Aggregation)

`GET /api/admin/stats/payments`

```json
{
  "byStatus": {
    "confirmed": 450,
    "pending": 5,
    "failed": 12
  },
  "recentPayments": [
    {
      "id": "...",
      "date": "2026-03-01",
      "amount": 500,
      "method": "manual",
      "status": "confirmed",
      "subscriptionId": "..."
    }
  ],
  "totalRevenue": 156000,
  "revenueThisMonth": 12500,
  "revenueLastMonth": 11800
}
```

### 2.5 Content Breakdown (Live Aggregation)

`GET /api/admin/stats/content`

```json
{
  "cases": {
    "total": 5400,
    "complete": 4800,
    "incomplete": 600,
    "verified": 4500,
    "stubs": 200,
    "byCourt": [
      { "name": "Supreme Court", "count": 1200 },
      { "name": "High Court", "count": 3100 }
    ],
    "byAreaOfLaw": [
      { "name": "Criminal Law", "count": 800 },
      { "name": "Commercial Law", "count": 650 }
    ]
  },
  "legislation": {
    "total": 1200,
    "byType": [
      { "name": "Act", "count": 450 },
      { "name": "Statutory Instrument", "count": 750 }
    ]
  }
}
```

## 3. DailyStats Model

New model replacing/extending the existing UserStats:

```json
{
  "name": "DailyStats",
  "base": "PersistedModel",
  "properties": {
    "snapshotDate": { "type": "date", "required": true, "index": true },
    "totalUsers": { "type": "number", "default": 0 },
    "newUsers": { "type": "number", "default": 0 },
    "activeUsers": { "type": "number", "default": 0 },
    "totalCases": { "type": "number", "default": 0 },
    "totalLegislation": { "type": "number", "default": 0 },
    "activeSubscriptions": { "type": "number", "default": 0 },
    "newSubscriptions": { "type": "number", "default": 0 },
    "churnedSubscriptions": { "type": "number", "default": 0 },
    "totalRevenue": { "type": "number", "default": 0 },
    "dailyRevenue": { "type": "number", "default": 0 },
    "totalOrganizations": { "type": "number", "default": 0 },
    "aiQueries": { "type": "number", "default": 0 }
  }
}
```

- Indexed on `snapshotDate` for fast range queries
- One document per day
- Upsert pattern: if today's snapshot exists, update it; otherwise create

## 4. Daily Scheduler Update

Extend the existing scheduler in `server/boot/schedule.js`:

- Run daily at 17:00 (existing schedule)
- Count all metrics from their respective collections
- Upsert today's DailyStats document
- `newUsers` = users with `createdAt` today
- `activeUsers` = users with `lastLogin` within last 30 days
- `newSubscriptions` = subscriptions with `createdAt` today
- `churnedSubscriptions` = subscriptions that became expired or cancelled today
- `dailyRevenue` = sum of confirmed payments with `date` today
- `totalRevenue` = sum of all confirmed payments
- `aiQueries` = read from today's counter (incremented by ask-ai endpoints)

## 5. AI Query Counter

Lightweight approach — increment a counter in today's DailyStats document each time an ask-ai endpoint is called:

- In `search.js` ask-ai handlers (authenticated and streaming): after successful response, fire-and-forget increment `DailyStats.aiQueries` for today
- Uses MongoDB `$inc` operator via upsert — no read required, minimal overhead
- No detailed query logging (can be added later if needed)

## 6. Security

- All admin endpoints behind `requireAdmin` middleware
- Admin middleware: verify JWT → load user → check `role === "admin"` → proceed or 403
- `role` field hidden from regular API responses (in AppUser `hidden` array)
- No endpoint to self-promote to admin (prevents privilege escalation)

## 7. Error Handling

- Invalid `period` query param → 400 with message
- Database errors → 500 with generic message (no internal details leaked)
- Non-admin access → 403 `{ error: { statusCode: 403, message: "Admin access required" } }`
- Unauthenticated → 401 (from JWT middleware)
