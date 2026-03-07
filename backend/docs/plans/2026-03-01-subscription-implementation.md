# Subscription System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add B2B and B2C subscription functionality with manual payment, organization user management, and email invitations.

**Architecture:** Extend existing LoopBack 3 models (Subscription, Payment, Organization) and add new models (OrganizationMember, Invitation). All new API routes live in boot scripts following the pattern established in `server/boot/auth-routes.js`. JWT auth middleware is extracted into a shared helper for reuse.

**Tech Stack:** LoopBack 3, MongoDB (apptorney datasource), JWT (jsonwebtoken), Mailgun (mailgun-js), Node 8 compatible ES5/var syntax.

**Design doc:** `docs/plans/2026-03-01-subscription-system-design.md`

---

## Important Conventions

- **All code must use `var` (not `let`/`const`)** — Node 8 compatibility
- **All callbacks use Node-style** `function(err, result)` — no Promises/async-await
- **Model references:** Use `app.models.ModelName` pattern (e.g., `app.models.subscription`)
- **Error responses:** Use `res.status(code).json({ error: { statusCode, message } })` pattern from auth-routes.js
- **JWT verification:** Use `jwtHelper.verifyAccessToken(token)` — returns `{ sub: userId, email }` or `null`
- **Email:** Use `mail.sendEmail(recipient, subject, template, values)` for templated email or plain text via mailgun

---

## Task 1: Extract JWT Auth Middleware

The auth-routes.js boot script verifies JWT tokens inline. We need a reusable middleware for subscription and org routes.

**Files:**
- Create: `common/models/shared/auth-middleware.js`

**Step 1: Create the auth middleware**

```javascript
// common/models/shared/auth-middleware.js
var jwtHelper = require('./jwt')

module.exports.requireAuth = function (req, res, next) {
    var authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: { statusCode: 401, message: 'Authentication required' }
        })
    }

    var token = authHeader.split(' ')[1]
    var decoded = jwtHelper.verifyAccessToken(token)
    if (!decoded) {
        return res.status(401).json({
            error: { statusCode: 401, message: 'Invalid or expired token' }
        })
    }

    req.userId = decoded.sub
    req.userEmail = decoded.email
    next()
}
```

**Step 2: Verify it works by requiring it in a node REPL**

Run: `cd /Users/muchukaingu/Documents/1.\ Work/4.\ apptorney/Projects/Development/apptorney-backend && node -e "var m = require('./common/models/shared/auth-middleware'); console.log(typeof m.requireAuth)"`

Expected: `function`

**Step 3: Commit**

```bash
git add common/models/shared/auth-middleware.js
git commit -m "feat: extract reusable JWT auth middleware"
```

---

## Task 2: Rework Subscription Model Schema

Replace the skeletal subscription.json with the full schema from the design.

**Files:**
- Modify: `common/models/subscription.json`

**Step 1: Replace subscription.json**

```json
{
    "name": "subscription",
    "plural": "subscriptions",
    "base": "PersistedModel",
    "idInjection": true,
    "options": {
        "validateUpsert": true
    },
    "mixins": {
        "TimeStamp": true
    },
    "properties": {
        "type": {
            "type": "string",
            "required": true,
            "description": "individual or organization"
        },
        "plan": {
            "type": "string",
            "required": true,
            "description": "b2c_standard or b2b_per_user"
        },
        "billingPeriod": {
            "type": "string",
            "required": true,
            "description": "monthly or annual"
        },
        "status": {
            "type": "string",
            "required": true,
            "default": "pending",
            "description": "pending, active, expired, cancelled"
        },
        "pricePerUser": {
            "type": "number",
            "required": true
        },
        "maxUsers": {
            "type": "number",
            "required": true,
            "default": 1
        },
        "activationDate": {
            "type": "date"
        },
        "expiryDate": {
            "type": "date"
        },
        "autoRenew": {
            "type": "boolean",
            "default": false
        }
    },
    "validations": [],
    "relations": {
        "owner": {
            "type": "belongsTo",
            "model": "appuser",
            "foreignKey": "ownerId"
        },
        "organization": {
            "type": "belongsTo",
            "model": "Organization",
            "foreignKey": "organizationId"
        },
        "payments": {
            "type": "hasMany",
            "model": "payment",
            "foreignKey": "subscriptionId"
        }
    },
    "acls": [],
    "methods": {}
}
```

**Step 2: Commit**

```bash
git add common/models/subscription.json
git commit -m "feat: rework subscription model schema for B2B/B2C"
```

---

## Task 3: Rework Subscription Model Logic

Replace `subscription.js` with the new subscribe endpoint logic and status checking.

**Files:**
- Modify: `common/models/subscription.js`

**Step 1: Replace subscription.js**

```javascript
'use strict';

module.exports = function (Subscription) {

    // ── Pricing configuration ──────────────────────────────────────
    // TODO: Move to database or config when payment gateway is integrated
    var PRICING = {
        b2c_standard: { monthly: 50, annual: 500 },
        b2b_per_user: { monthly: 40, annual: 400 }
    };

    Subscription.getPricing = function () {
        return PRICING;
    };

    // ── Check if a subscription is currently active ────────────────
    Subscription.isActive = function (subscription) {
        if (!subscription) return false;
        if (subscription.status !== 'active') return false;
        if (!subscription.expiryDate) return false;
        return new Date(subscription.expiryDate) > new Date();
    };

    // ── Calculate expiry date from activation ──────────────────────
    Subscription.calculateExpiry = function (activationDate, billingPeriod) {
        var expiry = new Date(activationDate);
        if (billingPeriod === 'annual') {
            expiry.setDate(expiry.getDate() + 365);
        } else {
            expiry.setDate(expiry.getDate() + 30);
        }
        return expiry;
    };
};
```

**Step 2: Verify module loads**

Run: `node -e "var fn = require('./common/models/subscription'); console.log(typeof fn)"`

Expected: `function`

**Step 3: Commit**

```bash
git add common/models/subscription.js
git commit -m "feat: add subscription pricing, isActive, and calculateExpiry helpers"
```

---

## Task 4: Enhance Payment Model

Add new fields and relations to payment.json for the manual payment flow.

**Files:**
- Modify: `common/models/payment.json`
- Modify: `common/models/payment.js`

**Step 1: Replace payment.json**

```json
{
    "name": "payment",
    "plural": "payments",
    "base": "PersistedModel",
    "idInjection": true,
    "options": {
        "validateUpsert": true
    },
    "mixins": {
        "TimeStamp": true
    },
    "properties": {
        "date": {
            "type": "date",
            "required": true
        },
        "amount": {
            "type": "number",
            "required": true
        },
        "method": {
            "type": "string",
            "required": true,
            "default": "manual",
            "description": "manual for now; stripe/paystack later"
        },
        "status": {
            "type": "string",
            "required": true,
            "default": "pending",
            "description": "pending, confirmed, failed"
        },
        "reference": {
            "type": "string",
            "description": "External payment reference (e.g. bank transfer ref)"
        },
        "notes": {
            "type": "string"
        }
    },
    "validations": [],
    "relations": {
        "subscription": {
            "type": "belongsTo",
            "model": "subscription",
            "foreignKey": "subscriptionId"
        },
        "paidBy": {
            "type": "belongsTo",
            "model": "appuser",
            "foreignKey": "paidById"
        }
    },
    "acls": [],
    "methods": {}
}
```

**Step 2: Commit**

```bash
git add common/models/payment.json common/models/payment.js
git commit -m "feat: enhance payment model with status, method, and relations"
```

---

## Task 5: Create OrganizationMember Model

New model for B2B organization membership and roles.

**Files:**
- Create: `common/models/organization-member.json`
- Create: `common/models/organization-member.js`
- Modify: `server/model-config.json` (add entry)

**Step 1: Create organization-member.json**

```json
{
    "name": "OrganizationMember",
    "plural": "organization-members",
    "base": "PersistedModel",
    "idInjection": true,
    "options": {
        "validateUpsert": true
    },
    "mixins": {
        "TimeStamp": true
    },
    "properties": {
        "role": {
            "type": "string",
            "required": true,
            "default": "member",
            "description": "admin or member"
        },
        "status": {
            "type": "string",
            "required": true,
            "default": "active",
            "description": "active, suspended, removed"
        },
        "joinedAt": {
            "type": "date",
            "required": true
        },
        "isOwner": {
            "type": "boolean",
            "default": false,
            "description": "True for the subscription creator. Cannot be removed or demoted."
        }
    },
    "validations": [],
    "relations": {
        "organization": {
            "type": "belongsTo",
            "model": "Organization",
            "foreignKey": "organizationId"
        },
        "user": {
            "type": "belongsTo",
            "model": "appuser",
            "foreignKey": "appuserId"
        },
        "subscription": {
            "type": "belongsTo",
            "model": "subscription",
            "foreignKey": "subscriptionId"
        }
    },
    "acls": [],
    "methods": {}
}
```

**Step 2: Create organization-member.js**

```javascript
'use strict';

module.exports = function (OrganizationMember) {

};
```

**Step 3: Add to model-config.json**

Add this entry after the `"subscription"` entry in `server/model-config.json`:

```json
"OrganizationMember": {
    "dataSource": "apptorney",
    "public": true
}
```

**Step 4: Verify model loads**

Run: `node -e "var app = require('./server/server'); app.on('started', function() { console.log(Object.keys(app.models).filter(function(k) { return k === 'OrganizationMember'; })); process.exit(0); });" 2>&1 | head -5`

**Step 5: Commit**

```bash
git add common/models/organization-member.json common/models/organization-member.js server/model-config.json
git commit -m "feat: add OrganizationMember model for B2B roles"
```

---

## Task 6: Create Invitation Model

New model for email-based user invitations.

**Files:**
- Create: `common/models/invitation.json`
- Create: `common/models/invitation.js`
- Modify: `server/model-config.json` (add entry)

**Step 1: Create invitation.json**

```json
{
    "name": "invitation",
    "plural": "invitations",
    "base": "PersistedModel",
    "idInjection": true,
    "options": {
        "validateUpsert": true
    },
    "mixins": {
        "TimeStamp": true
    },
    "properties": {
        "email": {
            "type": "string",
            "required": true
        },
        "token": {
            "type": "string",
            "required": true,
            "index": {
                "unique": true
            }
        },
        "role": {
            "type": "string",
            "required": true,
            "default": "member",
            "description": "admin or member"
        },
        "status": {
            "type": "string",
            "required": true,
            "default": "pending",
            "description": "pending, accepted, expired, cancelled"
        },
        "expiresAt": {
            "type": "date",
            "required": true
        }
    },
    "validations": [],
    "relations": {
        "organization": {
            "type": "belongsTo",
            "model": "Organization",
            "foreignKey": "organizationId"
        },
        "invitedBy": {
            "type": "belongsTo",
            "model": "appuser",
            "foreignKey": "invitedById"
        },
        "subscription": {
            "type": "belongsTo",
            "model": "subscription",
            "foreignKey": "subscriptionId"
        }
    },
    "acls": [],
    "methods": {}
}
```

**Step 2: Create invitation.js**

```javascript
'use strict';

module.exports = function (Invitation) {

};
```

**Step 3: Add to model-config.json**

Add this entry after `"OrganizationMember"` in `server/model-config.json`:

```json
"invitation": {
    "dataSource": "apptorney",
    "public": true
}
```

**Step 4: Commit**

```bash
git add common/models/invitation.json common/models/invitation.js server/model-config.json
git commit -m "feat: add Invitation model for B2B email invites"
```

---

## Task 7: Enhance Organization Model

Add new relations (members, invitations, subscription) to the existing Organization model.

**Files:**
- Modify: `common/models/Organization.json`

**Step 1: Update Organization.json relations**

Replace the `"relations"` section in `common/models/Organization.json`:

```json
"relations": {
    "employees": {
        "type": "hasMany",
        "model": "Customer",
        "foreignKey": ""
    },
    "members": {
        "type": "hasMany",
        "model": "OrganizationMember",
        "foreignKey": "organizationId"
    },
    "invitations": {
        "type": "hasMany",
        "model": "invitation",
        "foreignKey": "organizationId"
    },
    "subscription": {
        "type": "hasOne",
        "model": "subscription",
        "foreignKey": "organizationId"
    }
}
```

Also relax the required fields — B2B orgs created during subscription may not have a physical address yet:

Change `physicalAddress` from `"required": true` to `"required": false`.
Change `contact` from `"required": true` to `"required": false`.

**Step 2: Commit**

```bash
git add common/models/Organization.json
git commit -m "feat: add org member, invitation, and subscription relations to Organization"
```

---

## Task 8: Create Subscription Routes Boot Script

This is the core subscription API — subscribe, check status, get my subscription.

**Files:**
- Create: `server/boot/subscription-routes.js`

**Step 1: Create subscription-routes.js**

```javascript
'use strict';

var authMiddleware = require('../../common/models/shared/auth-middleware')
var crypto = require('crypto')

module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var requireAuth = authMiddleware.requireAuth

    // ── POST /api/subscriptions/subscribe ──────────────────────────
    app.post(restRoot + '/subscriptions/subscribe', requireAuth, function (req, res, next) {
        var body = req.body || {}
        var plan = body.plan
        var billingPeriod = body.billingPeriod
        var userId = req.userId

        // Validate plan
        if (!plan || ['b2c_standard', 'b2b_per_user'].indexOf(plan) === -1) {
            return sendError(res, 400, 'Invalid plan. Must be b2c_standard or b2b_per_user')
        }
        if (!billingPeriod || ['monthly', 'annual'].indexOf(billingPeriod) === -1) {
            return sendError(res, 400, 'Invalid billingPeriod. Must be monthly or annual')
        }

        var Subscription = app.models.subscription
        var Appuser = app.models.appuser || app.models.Appuser
        var pricing = Subscription.getPricing()
        var pricePerUser = pricing[plan][billingPeriod]

        if (plan === 'b2c_standard') {
            createB2CSubscription(userId, billingPeriod, pricePerUser, res, next)
        } else {
            var organizationName = (body.organizationName || '').trim()
            var maxUsers = parseInt(body.maxUsers, 10)
            if (!organizationName) {
                return sendError(res, 400, 'organizationName is required for B2B subscriptions')
            }
            if (!maxUsers || maxUsers < 1) {
                return sendError(res, 400, 'maxUsers must be at least 1')
            }
            createB2BSubscription(userId, organizationName, maxUsers, billingPeriod, pricePerUser, res, next)
        }
    })

    // ── GET /api/subscriptions/mine ────────────────────────────────
    app.get(restRoot + '/subscriptions/mine', requireAuth, function (req, res, next) {
        var userId = req.userId
        var Subscription = app.models.subscription
        var OrganizationMember = app.models.OrganizationMember

        // First check for individual subscription
        Subscription.findOne({
            where: { ownerId: userId, type: 'individual' },
            include: 'payments'
        }, function (err, sub) {
            if (err) return next(err)
            if (sub) {
                return res.json({ subscription: sub, membershipType: 'individual' })
            }

            // Check for organization membership
            OrganizationMember.findOne({
                where: { appuserId: userId, status: 'active' },
                include: ['organization', 'subscription']
            }, function (memErr, membership) {
                if (memErr) return next(memErr)
                if (!membership) {
                    return res.json({ subscription: null, membershipType: null })
                }

                res.json({
                    subscription: membership.subscription,
                    membershipType: 'organization',
                    membership: {
                        role: membership.role,
                        isOwner: membership.isOwner,
                        organizationId: membership.organizationId
                    }
                })
            })
        })
    })

    // ── GET /api/subscriptions/:id/status ──────────────────────────
    app.get(restRoot + '/subscriptions/:id/status', requireAuth, function (req, res, next) {
        var Subscription = app.models.subscription
        Subscription.findById(req.params.id, function (err, sub) {
            if (err) return next(err)
            if (!sub) {
                return sendError(res, 404, 'Subscription not found')
            }

            var isActive = Subscription.isActive(sub)
            res.json({
                id: sub.id,
                status: sub.status,
                isActive: isActive,
                expiryDate: sub.expiryDate,
                plan: sub.plan,
                type: sub.type
            })
        })
    })

    // ── POST /api/payments/confirm (admin only) ────────────────────
    // TODO: Add proper system admin check. For now, any authenticated user
    // can confirm payments. Replace with role-based check when admin system is built.
    app.post(restRoot + '/payments/confirm', requireAuth, function (req, res, next) {
        var body = req.body || {}
        var subscriptionId = body.subscriptionId
        var amount = parseFloat(body.amount)
        var reference = (body.reference || '').trim()
        var notes = (body.notes || '').trim()

        if (!subscriptionId) {
            return sendError(res, 400, 'subscriptionId is required')
        }
        if (!amount || amount <= 0) {
            return sendError(res, 400, 'amount must be a positive number')
        }

        var Subscription = app.models.subscription
        var Payment = app.models.payment

        Subscription.findById(subscriptionId, function (err, sub) {
            if (err) return next(err)
            if (!sub) {
                return sendError(res, 404, 'Subscription not found')
            }

            var now = new Date()
            var expiryDate = Subscription.calculateExpiry(now, sub.billingPeriod)

            // Create payment record
            Payment.create({
                date: now,
                amount: amount,
                method: 'manual',
                status: 'confirmed',
                reference: reference,
                notes: notes,
                subscriptionId: sub.id,
                paidById: req.userId
            }, function (payErr, payment) {
                if (payErr) return next(payErr)

                // Activate the subscription
                sub.updateAttributes({
                    status: 'active',
                    activationDate: now,
                    expiryDate: expiryDate
                }, function (updateErr, updated) {
                    if (updateErr) return next(updateErr)

                    // Also update the owner's currentSubscription field
                    var Appuser = app.models.appuser || app.models.Appuser
                    Appuser.findById(sub.ownerId, function (userErr, user) {
                        if (!userErr && user) {
                            user.updateAttributes({ currentSubscription: String(sub.id) }, function () {
                                // Ignore errors on this update
                            })
                        }
                    })

                    res.json({
                        success: true,
                        message: 'Payment confirmed and subscription activated',
                        subscription: updated,
                        payment: payment
                    })
                })
            })
        })
    })

    // ── GET /api/subscriptions/pricing ─────────────────────────────
    app.get(restRoot + '/subscriptions/pricing', function (req, res) {
        var Subscription = app.models.subscription
        res.json(Subscription.getPricing())
    })

    // ── B2C creation helper ────────────────────────────────────────
    function createB2CSubscription(userId, billingPeriod, pricePerUser, res, next) {
        var Subscription = app.models.subscription

        // Check if user already has an active subscription
        Subscription.findOne({
            where: { ownerId: userId, type: 'individual', status: { inq: ['pending', 'active'] } }
        }, function (err, existing) {
            if (err) return next(err)
            if (existing) {
                return sendError(res, 409, 'You already have an active or pending subscription')
            }

            Subscription.create({
                type: 'individual',
                plan: 'b2c_standard',
                billingPeriod: billingPeriod,
                status: 'pending',
                pricePerUser: pricePerUser,
                maxUsers: 1,
                autoRenew: false,
                ownerId: userId
            }, function (createErr, sub) {
                if (createErr) return next(createErr)

                var totalAmount = pricePerUser
                res.json({
                    success: true,
                    message: 'Subscription created. Please complete payment to activate.',
                    subscription: sub,
                    paymentDetails: {
                        amount: totalAmount,
                        billingPeriod: billingPeriod,
                        instructions: 'Please make a manual payment and provide the reference to your administrator.'
                    }
                })
            })
        })
    }

    // ── B2B creation helper ────────────────────────────────────────
    function createB2BSubscription(userId, organizationName, maxUsers, billingPeriod, pricePerUser, res, next) {
        var Subscription = app.models.subscription
        var Organization = app.models.Organization
        var OrganizationMember = app.models.OrganizationMember

        // Create organization
        Organization.create({
            name: organizationName
        }, function (orgErr, org) {
            if (orgErr) return next(orgErr)

            // Create subscription linked to org
            Subscription.create({
                type: 'organization',
                plan: 'b2b_per_user',
                billingPeriod: billingPeriod,
                status: 'pending',
                pricePerUser: pricePerUser,
                maxUsers: maxUsers,
                autoRenew: false,
                ownerId: userId,
                organizationId: org.id
            }, function (subErr, sub) {
                if (subErr) return next(subErr)

                // Create the subscribing user as admin + owner
                OrganizationMember.create({
                    role: 'admin',
                    status: 'active',
                    joinedAt: new Date(),
                    isOwner: true,
                    organizationId: org.id,
                    appuserId: userId,
                    subscriptionId: sub.id
                }, function (memErr, member) {
                    if (memErr) return next(memErr)

                    var totalAmount = pricePerUser * maxUsers
                    res.json({
                        success: true,
                        message: 'Organization and subscription created. Please complete payment to activate.',
                        subscription: sub,
                        organization: org,
                        membership: member,
                        paymentDetails: {
                            amount: totalAmount,
                            billingPeriod: billingPeriod,
                            perUserPrice: pricePerUser,
                            maxUsers: maxUsers,
                            instructions: 'Please make a manual payment and provide the reference to your administrator.'
                        }
                    })
                })
            })
        })
    }

    // ── Helper ─────────────────────────────────────────────────────
    function sendError(res, statusCode, message) {
        res.status(statusCode).json({
            error: { statusCode: statusCode, message: message }
        })
    }
}
```

**Step 2: Verify the boot script loads**

Run: `node -e "var fn = require('./server/boot/subscription-routes'); console.log(typeof fn)"`

Expected: `function`

**Step 3: Commit**

```bash
git add server/boot/subscription-routes.js
git commit -m "feat: add subscription routes (subscribe, mine, status, pricing, payment confirm)"
```

---

## Task 9: Create Organization Routes Boot Script

Handles invitations, member management, and role assignment.

**Files:**
- Create: `server/boot/organization-routes.js`

**Step 1: Create organization-routes.js**

```javascript
'use strict';

var authMiddleware = require('../../common/models/shared/auth-middleware')
var mail = require('../../common/models/shared/mail')
var crypto = require('crypto')

module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var requireAuth = authMiddleware.requireAuth

    // ── POST /api/organizations/:orgId/invite ──────────────────────
    app.post(restRoot + '/organizations/:orgId/invite', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId
        var userId = req.userId
        var body = req.body || {}
        var email = (body.email || '').trim().toLowerCase()
        var role = body.role || 'member'

        if (!email) {
            return sendError(res, 400, 'Email is required')
        }
        if (['admin', 'member'].indexOf(role) === -1) {
            return sendError(res, 400, 'Role must be admin or member')
        }

        // Verify caller is org admin
        requireOrgAdmin(orgId, userId, function (err, callerMember) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var Subscription = app.models.subscription
            var OrganizationMember = app.models.OrganizationMember
            var Invitation = app.models.invitation

            // Get the org's subscription
            Subscription.findOne({
                where: { organizationId: orgId, status: { inq: ['active', 'pending'] } }
            }, function (subErr, sub) {
                if (subErr) return next(subErr)
                if (!sub) {
                    return sendError(res, 404, 'No active subscription found for this organization')
                }

                // Check seat availability
                OrganizationMember.count({
                    organizationId: orgId,
                    status: 'active'
                }, function (countErr, activeCount) {
                    if (countErr) return next(countErr)
                    if (activeCount >= sub.maxUsers) {
                        return sendError(res, 400, 'No seats available. Current: ' + activeCount + ', Max: ' + sub.maxUsers + '. Upgrade your subscription to add more users.')
                    }

                    // Check for duplicate pending invitation
                    Invitation.findOne({
                        where: { organizationId: orgId, email: email, status: 'pending' }
                    }, function (dupErr, existing) {
                        if (dupErr) return next(dupErr)
                        if (existing) {
                            return sendError(res, 409, 'An invitation is already pending for this email')
                        }

                        // Create invitation
                        var token = crypto.randomBytes(32).toString('hex')
                        var expiresAt = new Date()
                        expiresAt.setDate(expiresAt.getDate() + 7)

                        Invitation.create({
                            email: email,
                            token: token,
                            role: role,
                            status: 'pending',
                            expiresAt: expiresAt,
                            organizationId: orgId,
                            invitedById: userId,
                            subscriptionId: sub.id
                        }, function (invErr, invitation) {
                            if (invErr) return next(invErr)

                            // Send invitation email
                            var Organization = app.models.Organization
                            Organization.findById(orgId, function (orgFindErr, org) {
                                var orgName = org ? org.name : 'an organization'
                                // TODO: Replace with a proper frontend URL when available
                                var inviteLink = 'https://apptorney.org/invite/' + token

                                mail.sendEmail(
                                    email,
                                    'You\'ve been invited to join ' + orgName + ' on Apptorney',
                                    null,
                                    null
                                )
                                // For now, send a plain text email since we don't have a template yet
                                var mailgun = require('mailgun-js')
                                var mg = mailgun({
                                    apiKey: 'bb9112c75588d7294dddd31c539df299-77751bfc-f4281491',
                                    domain: 'mg.apptorney.org'
                                })
                                mg.messages().send({
                                    from: 'Apptorney <postmaster@mg.apptorney.org>',
                                    to: email,
                                    subject: 'You\'ve been invited to join ' + orgName + ' on Apptorney',
                                    text: 'You have been invited to join ' + orgName + ' on Apptorney as a ' + role + '.\n\n' +
                                        'Click the link below to accept the invitation:\n' +
                                        inviteLink + '\n\n' +
                                        'This invitation expires in 7 days.\n\n' +
                                        '- The Apptorney Team'
                                }, function (mailErr) {
                                    if (mailErr) {
                                        console.log('Invitation email error:', mailErr)
                                    }
                                })

                                res.json({
                                    success: true,
                                    message: 'Invitation sent to ' + email,
                                    invitation: {
                                        id: invitation.id,
                                        email: email,
                                        role: role,
                                        status: 'pending',
                                        expiresAt: expiresAt
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    // ── POST /api/invitations/:token/accept ────────────────────────
    app.post(restRoot + '/invitations/:token/accept', requireAuth, function (req, res, next) {
        var token = req.params.token
        var userId = req.userId

        var Invitation = app.models.invitation
        var OrganizationMember = app.models.OrganizationMember
        var Appuser = app.models.appuser || app.models.Appuser

        Invitation.findOne({ where: { token: token } }, function (err, invitation) {
            if (err) return next(err)
            if (!invitation) {
                return sendError(res, 404, 'Invitation not found')
            }
            if (invitation.status !== 'pending') {
                return sendError(res, 400, 'This invitation has already been ' + invitation.status)
            }
            if (new Date() > new Date(invitation.expiresAt)) {
                invitation.updateAttributes({ status: 'expired' }, function () {})
                return sendError(res, 400, 'This invitation has expired')
            }

            // Verify the accepting user's email matches the invitation
            Appuser.findById(userId, function (userErr, user) {
                if (userErr) return next(userErr)
                if (!user) {
                    return sendError(res, 404, 'User not found')
                }
                if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
                    return sendError(res, 403, 'This invitation was sent to a different email address')
                }

                // Check if already a member
                OrganizationMember.findOne({
                    where: { organizationId: invitation.organizationId, appuserId: userId, status: 'active' }
                }, function (memErr, existing) {
                    if (memErr) return next(memErr)
                    if (existing) {
                        invitation.updateAttributes({ status: 'accepted' }, function () {})
                        return sendError(res, 409, 'You are already a member of this organization')
                    }

                    // Create membership
                    OrganizationMember.create({
                        role: invitation.role,
                        status: 'active',
                        joinedAt: new Date(),
                        isOwner: false,
                        organizationId: invitation.organizationId,
                        appuserId: userId,
                        subscriptionId: invitation.subscriptionId
                    }, function (createErr, member) {
                        if (createErr) return next(createErr)

                        // Mark invitation as accepted
                        invitation.updateAttributes({ status: 'accepted' }, function () {})

                        res.json({
                            success: true,
                            message: 'You have joined the organization',
                            membership: member
                        })
                    })
                })
            })
        })
    })

    // ── GET /api/organizations/:orgId/members ──────────────────────
    app.get(restRoot + '/organizations/:orgId/members', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId
        var userId = req.userId

        requireOrgAdmin(orgId, userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var OrganizationMember = app.models.OrganizationMember
            OrganizationMember.find({
                where: { organizationId: orgId, status: 'active' },
                include: 'user'
            }, function (findErr, members) {
                if (findErr) return next(findErr)

                // Map to safe response (don't leak full user data)
                var result = members.map(function (m) {
                    var memberJson = m.toJSON()
                    var user = memberJson.user || {}
                    return {
                        id: memberJson.id,
                        role: memberJson.role,
                        isOwner: memberJson.isOwner,
                        joinedAt: memberJson.joinedAt,
                        user: {
                            id: user.id,
                            email: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname
                        }
                    }
                })

                res.json({ members: result })
            })
        })
    })

    // ── GET /api/organizations/:orgId/invitations ──────────────────
    app.get(restRoot + '/organizations/:orgId/invitations', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId
        var userId = req.userId

        requireOrgAdmin(orgId, userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var Invitation = app.models.invitation
            Invitation.find({
                where: { organizationId: orgId, status: 'pending' }
            }, function (findErr, invitations) {
                if (findErr) return next(findErr)
                res.json({ invitations: invitations })
            })
        })
    })

    // ── PUT /api/organizations/:orgId/members/:memberId ────────────
    app.put(restRoot + '/organizations/:orgId/members/:memberId', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId
        var memberId = req.params.memberId
        var userId = req.userId
        var body = req.body || {}
        var newRole = body.role

        if (!newRole || ['admin', 'member'].indexOf(newRole) === -1) {
            return sendError(res, 400, 'Role must be admin or member')
        }

        requireOrgAdmin(orgId, userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var OrganizationMember = app.models.OrganizationMember
            OrganizationMember.findById(memberId, function (findErr, member) {
                if (findErr) return next(findErr)
                if (!member || String(member.organizationId) !== String(orgId)) {
                    return sendError(res, 404, 'Member not found in this organization')
                }

                // Protect the owner
                if (member.isOwner) {
                    return sendError(res, 403, 'Cannot change the role of the subscription owner')
                }

                member.updateAttributes({ role: newRole }, function (updateErr, updated) {
                    if (updateErr) return next(updateErr)
                    res.json({
                        success: true,
                        message: 'Member role updated to ' + newRole,
                        member: updated
                    })
                })
            })
        })
    })

    // ── DELETE /api/organizations/:orgId/members/:memberId ─────────
    app.delete(restRoot + '/organizations/:orgId/members/:memberId', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId
        var memberId = req.params.memberId
        var userId = req.userId

        requireOrgAdmin(orgId, userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var OrganizationMember = app.models.OrganizationMember
            OrganizationMember.findById(memberId, function (findErr, member) {
                if (findErr) return next(findErr)
                if (!member || String(member.organizationId) !== String(orgId)) {
                    return sendError(res, 404, 'Member not found in this organization')
                }

                // Protect the owner
                if (member.isOwner) {
                    return sendError(res, 403, 'Cannot remove the subscription owner')
                }

                member.updateAttributes({ status: 'removed' }, function (updateErr) {
                    if (updateErr) return next(updateErr)
                    res.json({
                        success: true,
                        message: 'Member removed from organization'
                    })
                })
            })
        })
    })

    // ── Helpers ────────────────────────────────────────────────────

    function requireOrgAdmin(orgId, userId, cb) {
        var OrganizationMember = app.models.OrganizationMember
        OrganizationMember.findOne({
            where: { organizationId: orgId, appuserId: userId, status: 'active', role: 'admin' }
        }, function (err, member) {
            if (err) return cb(err)
            if (!member) {
                var forbidden = new Error('You must be an organization admin to perform this action')
                forbidden.statusCode = 403
                return cb(forbidden)
            }
            cb(null, member)
        })
    }

    function sendError(res, statusCode, message) {
        res.status(statusCode).json({
            error: { statusCode: statusCode, message: message }
        })
    }
}
```

**Step 2: Verify the boot script loads**

Run: `node -e "var fn = require('./server/boot/organization-routes'); console.log(typeof fn)"`

Expected: `function`

**Step 3: Commit**

```bash
git add server/boot/organization-routes.js
git commit -m "feat: add organization routes (invite, accept, members, role update, remove)"
```

---

## Task 10: Add Invite Email Helper to Mail Module

Add a dedicated invite email function to the shared mail module (cleaner than inline mailgun in the route).

**Files:**
- Modify: `common/models/shared/mail.js`

**Step 1: Add sendInviteEmail function**

Append this function to the end of `common/models/shared/mail.js`:

```javascript
module.exports.sendInviteEmail = function (recipient, organizationName, role, inviteLink) {
    var DOMAIN = "mg.apptorney.org";
    var mg = mailgun({
        apiKey: "bb9112c75588d7294dddd31c539df299-77751bfc-f4281491",
        domain: DOMAIN
    });
    var data = {
        from: "Apptorney <postmaster@mg.apptorney.org>",
        to: recipient,
        subject: "You've been invited to join " + organizationName + " on Apptorney",
        text: "You have been invited to join " + organizationName + " on Apptorney as a " + role + ".\n\n" +
            "Click the link below to accept the invitation:\n" +
            inviteLink + "\n\n" +
            "This invitation expires in 7 days.\n\n" +
            "- The Apptorney Team"
    };

    mg.messages().send(data, function (error, body) {
        if (error) {
            console.log("Invitation email error:", error);
        }
    });
};
```

**Step 2: Update organization-routes.js to use the new helper**

In `server/boot/organization-routes.js`, replace the inline mailgun email sending block in the invite endpoint with:

```javascript
mail.sendInviteEmail(email, orgName, role, inviteLink)
```

Remove the inline `var mailgun = require('mailgun-js')` block and the `mg.messages().send(...)` call.

**Step 3: Commit**

```bash
git add common/models/shared/mail.js server/boot/organization-routes.js
git commit -m "refactor: extract invite email into shared mail helper"
```

---

## Task 11: Manual Smoke Test

Start the server and verify endpoints respond correctly.

**Step 1: Start the server**

Run: `node server/server.js`

**Step 2: Test pricing endpoint (no auth needed)**

Run: `curl -s http://localhost:3000/api/subscriptions/pricing | python -m json.tool`

Expected: JSON with `b2c_standard` and `b2b_per_user` pricing

**Step 3: Test subscribe without auth**

Run: `curl -s -X POST http://localhost:3000/api/subscriptions/subscribe -H 'Content-Type: application/json' -d '{"plan":"b2c_standard","billingPeriod":"monthly"}'`

Expected: 401 "Authentication required"

**Step 4: Test member listing without auth**

Run: `curl -s http://localhost:3000/api/organizations/fakeid/members`

Expected: 401 "Authentication required"

**Step 5: Stop server and commit if any fixes were needed**

---

## Task 12: Add Payment Gateway TODO Comments

Add structured TODO comments in key locations for future payment gateway integration.

**Files:**
- Modify: `server/boot/subscription-routes.js`

**Step 1: Add TODO block at top of subscription-routes.js**

Add after the `'use strict'` line:

```javascript
// ╔═══════════════════════════════════════════════════════════════╗
// ║  TODO: PAYMENT GATEWAY INTEGRATION                           ║
// ║                                                               ║
// ║  When integrating a payment gateway (Stripe/PayStack/DPO):    ║
// ║  1. Add POST /api/payments/initiate — creates checkout        ║
// ║  2. Add POST /api/payments/webhook — receives payment events  ║
// ║  3. Auto-activate subscription on successful payment webhook  ║
// ║  4. Add auto-renewal logic with stored payment methods        ║
// ║  5. Add invoice generation and receipt emails                 ║
// ║  6. Replace manual payment confirmation with webhook flow     ║
// ║  7. Move pricing config to database for admin management      ║
// ║  8. Add subscription upgrade/downgrade with prorated billing  ║
// ╚═══════════════════════════════════════════════════════════════╝
```

**Step 2: Commit**

```bash
git add server/boot/subscription-routes.js
git commit -m "docs: add structured TODO for payment gateway integration"
```

---

## Summary of All Files

| Action | File | Purpose |
|--------|------|---------|
| Create | `common/models/shared/auth-middleware.js` | Reusable JWT auth middleware |
| Modify | `common/models/subscription.json` | Reworked schema with B2B/B2C fields |
| Modify | `common/models/subscription.js` | Pricing, isActive, calculateExpiry helpers |
| Modify | `common/models/payment.json` | Relations and new fields |
| Create | `common/models/organization-member.json` | B2B membership model |
| Create | `common/models/organization-member.js` | Membership logic (empty for now) |
| Create | `common/models/invitation.json` | Email invitation model |
| Create | `common/models/invitation.js` | Invitation logic (empty for now) |
| Modify | `common/models/Organization.json` | New relations |
| Modify | `common/models/shared/mail.js` | Invite email helper |
| Create | `server/boot/subscription-routes.js` | Subscribe, status, pricing, payment confirm |
| Create | `server/boot/organization-routes.js` | Invite, accept, members, role update, remove |
| Modify | `server/model-config.json` | Register new models |
