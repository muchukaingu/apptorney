var authMiddleware = require('../../common/models/shared/auth-middleware')

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

module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var requireAuth = authMiddleware.requireAuth

    // ── POST /api/subscriptions/subscribe ──────────────────────────
    app.post(restRoot + '/subscriptions/subscribe', requireAuth, function (req, res, next) {
        var body = req.body || {}
        var plan = (body.plan || '').trim()
        var billingPeriod = (body.billingPeriod || '').trim()
        var userId = req.userId

        // Validate plan
        if (plan !== 'b2c_standard' && plan !== 'b2b_per_user') {
            return sendError(res, 400, 'Plan must be "b2c_standard" or "b2b_per_user"')
        }

        // Validate billing period
        if (billingPeriod !== 'monthly' && billingPeriod !== 'annual') {
            return sendError(res, 400, 'Billing period must be "monthly" or "annual"')
        }

        var Subscription = app.models.subscription
        var pricing = Subscription.getPricing()

        if (plan === 'b2c_standard') {
            // ── B2C Individual Subscription ──
            handleB2CSubscription(userId, plan, billingPeriod, pricing, Subscription, res, next)
        } else {
            // ── B2B Organization Subscription ──
            var organizationName = (body.organizationName || '').trim()
            var maxUsers = parseInt(body.maxUsers, 10)

            if (!organizationName) {
                return sendError(res, 400, 'Organization name is required for B2B plans')
            }
            if (!maxUsers || maxUsers < 1) {
                return sendError(res, 400, 'maxUsers must be at least 1')
            }

            handleB2BSubscription(userId, plan, billingPeriod, pricing, organizationName, maxUsers, app, res, next)
        }
    })

    // ── GET /api/subscriptions/pricing (public, no auth) ───────────
    // NOTE: Must be registered before :id routes to avoid matching "pricing" as an id
    app.get(restRoot + '/subscriptions/pricing', function (req, res) {
        var Subscription = app.models.subscription
        var pricing = Subscription.getPricing()
        return res.json({ pricing: pricing })
    })

    // ── GET /api/subscriptions/mine ────────────────────────────────
    app.get(restRoot + '/subscriptions/mine', requireAuth, function (req, res, next) {
        var userId = req.userId
        var Subscription = app.models.subscription
        var OrganizationMember = app.models.OrganizationMember

        // First check for individual subscription
        Subscription.findOne({ where: { ownerId: userId, type: 'individual' } }, function (err, sub) {
            if (err) return next(err)

            if (sub) {
                return res.json({
                    subscription: sub,
                    membershipType: 'individual'
                })
            }

            // Check for organization membership
            OrganizationMember.findOne({
                where: { appuserId: userId, status: 'active' },
                include: ['organization', 'subscription']
            }, function (memberErr, membership) {
                if (memberErr) return next(memberErr)

                if (!membership) {
                    return res.json({ subscription: null, membershipType: null })
                }

                var memberData = membership.toJSON ? membership.toJSON() : membership

                return res.json({
                    subscription: memberData.subscription || null,
                    membershipType: 'organization',
                    membership: {
                        id: memberData.id,
                        role: memberData.role,
                        isOwner: memberData.isOwner,
                        joinedAt: memberData.joinedAt,
                        organization: memberData.organization || null
                    }
                })
            })
        })
    })

    // ── GET /api/subscriptions/:id/status ──────────────────────────
    app.get(restRoot + '/subscriptions/:id/status', requireAuth, function (req, res, next) {
        var subscriptionId = req.params.id
        var Subscription = app.models.subscription

        Subscription.findById(subscriptionId, function (err, sub) {
            if (err) return next(err)
            if (!sub) {
                return sendError(res, 404, 'Subscription not found')
            }

            return res.json({
                id: sub.id,
                status: sub.status,
                isActive: Subscription.isActive(sub),
                expiryDate: sub.expiryDate,
                plan: sub.plan,
                type: sub.type
            })
        })
    })

    // ── POST /api/payments/confirm ─────────────────────────────────
    // TODO: Add system admin role check. Currently any authenticated user can
    // confirm payments. When a proper admin role system is implemented, restrict
    // this endpoint to system administrators only.
    app.post(restRoot + '/payments/confirm', requireAuth, function (req, res, next) {
        var body = req.body || {}
        var subscriptionId = body.subscriptionId
        var amount = parseFloat(body.amount)
        var userId = req.userId

        if (!subscriptionId) {
            return sendError(res, 400, 'subscriptionId is required')
        }
        if (!amount || amount <= 0) {
            return sendError(res, 400, 'A positive amount is required')
        }

        var Subscription = app.models.subscription
        var Payment = app.models.payment
        var Appuser = app.models.appuser || app.models.Appuser

        Subscription.findById(subscriptionId, function (err, sub) {
            if (err) return next(err)
            if (!sub) {
                return sendError(res, 404, 'Subscription not found')
            }

            // Create payment record
            Payment.create({
                subscriptionId: sub.id,
                paidById: userId,
                date: new Date(),
                amount: amount,
                method: 'manual',
                status: 'confirmed',
                reference: body.reference || null,
                notes: body.notes || null
            }, function (payErr, payment) {
                if (payErr) return next(payErr)

                // Activate subscription
                var now = new Date()
                sub.status = 'active'
                sub.activationDate = now
                sub.expiryDate = Subscription.calculateExpiry(now, sub.billingPeriod)

                sub.save(function (saveErr) {
                    if (saveErr) return next(saveErr)

                    // Update the subscription owner's currentSubscription field
                    Appuser.findById(sub.ownerId, function (userErr, owner) {
                        if (userErr) return next(userErr)

                        if (owner) {
                            owner.currentSubscription = sub.id.toString()
                            owner.save(function (ownerSaveErr) {
                                if (ownerSaveErr) {
                                    console.log('Warning: Failed to update owner currentSubscription:', ownerSaveErr.message)
                                }

                                return res.json({
                                    subscription: sub,
                                    payment: payment
                                })
                            })
                        } else {
                            return res.json({
                                subscription: sub,
                                payment: payment
                            })
                        }
                    })
                })
            })
        })
    })

    // ── B2C Handler ────────────────────────────────────────────────

    function handleB2CSubscription(userId, plan, billingPeriod, pricing, Subscription, res, next) {
        // Check user doesn't already have an active/pending individual subscription
        Subscription.findOne({
            where: {
                ownerId: userId,
                type: 'individual',
                status: { inq: ['active', 'pending'] }
            }
        }, function (err, existing) {
            if (err) return next(err)

            if (existing) {
                return sendError(res, 409, 'You already have an active or pending individual subscription')
            }

            var pricePerUser = pricing[plan][billingPeriod]

            Subscription.create({
                ownerId: userId,
                type: 'individual',
                plan: plan,
                billingPeriod: billingPeriod,
                status: 'pending',
                pricePerUser: pricePerUser,
                maxUsers: 1,
                autoRenew: false
            }, function (createErr, subscription) {
                if (createErr) return next(createErr)

                return res.json({
                    subscription: subscription,
                    payment: {
                        amount: pricePerUser,
                        billingPeriod: billingPeriod,
                        instructions: 'Please confirm payment to activate your subscription.'
                    }
                })
            })
        })
    }

    // ── B2B Handler ────────────────────────────────────────────────

    function handleB2BSubscription(userId, plan, billingPeriod, pricing, organizationName, maxUsers, app, res, next) {
        var Subscription = app.models.subscription
        var Organization = app.models.Organization
        var OrganizationMember = app.models.OrganizationMember
        var pricePerUser = pricing[plan][billingPeriod]
        var totalAmount = pricePerUser * maxUsers

        // Create Organization
        Organization.create({
            name: organizationName
        }, function (orgErr, organization) {
            if (orgErr) return next(orgErr)

            // Create Subscription linked to organization
            Subscription.create({
                ownerId: userId,
                organizationId: organization.id,
                type: 'organization',
                plan: plan,
                billingPeriod: billingPeriod,
                status: 'pending',
                pricePerUser: pricePerUser,
                maxUsers: maxUsers,
                autoRenew: false
            }, function (subErr, subscription) {
                if (subErr) return next(subErr)

                // Create OrganizationMember with role:admin, isOwner:true
                OrganizationMember.create({
                    organizationId: organization.id,
                    appuserId: userId,
                    subscriptionId: subscription.id,
                    role: 'admin',
                    status: 'active',
                    isOwner: true,
                    joinedAt: new Date()
                }, function (memberErr, membership) {
                    if (memberErr) return next(memberErr)

                    return res.json({
                        subscription: subscription,
                        organization: organization,
                        membership: membership,
                        payment: {
                            amount: totalAmount,
                            pricePerUser: pricePerUser,
                            maxUsers: maxUsers,
                            billingPeriod: billingPeriod,
                            instructions: 'Please confirm payment to activate your organization subscription.'
                        }
                    })
                })
            })
        })
    }

    // ── Helpers ────────────────────────────────────────────────────

    function sendError(res, statusCode, message) {
        res.status(statusCode).json({
            error: { statusCode: statusCode, message: message }
        })
    }
}
