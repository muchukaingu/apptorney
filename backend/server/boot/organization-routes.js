var crypto = require('crypto')
var authMiddleware = require('../../common/models/shared/auth-middleware')
var mail = require('../../common/models/shared/mail')

var INVITE_EXPIRY_DAYS = 7

module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'
    var requireAuth = authMiddleware.requireAuth

    // ── POST /api/organizations/:orgId/invite ──────────────────────────
    app.post(restRoot + '/organizations/:orgId/invite', requireAuth, function (req, res, next) {
        var body = req.body || {}
        var orgId = req.params.orgId
        var email = (body.email || '').trim().toLowerCase()
        var role = (body.role || 'member').trim().toLowerCase()

        if (!email) {
            return sendError(res, 400, 'Email is required')
        }
        if (role !== 'admin' && role !== 'member') {
            return sendError(res, 400, 'Role must be "admin" or "member"')
        }

        requireOrgAdmin(orgId, req.userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var Subscription = app.models.subscription
            var OrganizationMember = app.models.OrganizationMember
            var Invitation = app.models.invitation
            var Organization = app.models.Organization

            // Find the organization
            Organization.findById(orgId, function (err, org) {
                if (err) return next(err)
                if (!org) {
                    return sendError(res, 404, 'Organization not found')
                }

                // Find active or pending subscription for this org
                Subscription.findOne({
                    where: {
                        organizationId: orgId,
                        status: { inq: ['active', 'pending'] }
                    }
                }, function (err, subscription) {
                    if (err) return next(err)
                    if (!subscription) {
                        return sendError(res, 404, 'No active subscription found for this organization')
                    }

                    // Count active members to check seat availability
                    OrganizationMember.count({
                        organizationId: orgId,
                        status: 'active'
                    }, function (err, memberCount) {
                        if (err) return next(err)

                        if (memberCount >= subscription.maxUsers) {
                            return sendError(res, 400, 'No available seats. Your subscription allows ' + subscription.maxUsers + ' users.')
                        }

                        // Check for duplicate pending invitation
                        Invitation.findOne({
                            where: {
                                organizationId: orgId,
                                email: email,
                                status: 'pending'
                            }
                        }, function (err, existingInvite) {
                            if (err) return next(err)
                            if (existingInvite) {
                                return sendError(res, 409, 'A pending invitation already exists for this email')
                            }

                            // Create the invitation
                            var token = crypto.randomBytes(32).toString('hex')
                            var expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

                            Invitation.create({
                                email: email,
                                token: token,
                                role: role,
                                status: 'pending',
                                expiresAt: expiresAt,
                                organizationId: orgId,
                                invitedById: req.userId,
                                subscriptionId: subscription.id
                            }, function (err, invitation) {
                                if (err) return next(err)

                                // Send invite email
                                var inviteLink = 'https://apptorney.org/invite/' + token
                                mail.sendInviteEmail(email, org.name, role, inviteLink)

                                res.json({
                                    success: true,
                                    invitation: {
                                        id: invitation.id,
                                        email: invitation.email,
                                        role: invitation.role,
                                        status: invitation.status,
                                        expiresAt: invitation.expiresAt
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    // ── POST /api/invitations/:token/accept ────────────────────────────
    app.post(restRoot + '/invitations/:token/accept', requireAuth, function (req, res, next) {
        var token = req.params.token
        var Invitation = app.models.invitation
        var OrganizationMember = app.models.OrganizationMember

        Invitation.findOne({ where: { token: token } }, function (err, invitation) {
            if (err) return next(err)
            if (!invitation) {
                return sendError(res, 404, 'Invitation not found')
            }

            if (invitation.status !== 'pending') {
                return sendError(res, 400, 'This invitation is no longer pending')
            }

            // Check expiry
            if (new Date() > new Date(invitation.expiresAt)) {
                return sendError(res, 400, 'This invitation has expired')
            }

            // Verify accepting user's email matches invitation email (case-insensitive)
            if (req.userEmail.toLowerCase() !== invitation.email.toLowerCase()) {
                return sendError(res, 403, 'This invitation was sent to a different email address')
            }

            // Check user isn't already an active member of this org
            OrganizationMember.findOne({
                where: {
                    organizationId: invitation.organizationId,
                    appuserId: req.userId,
                    status: 'active'
                }
            }, function (err, existingMember) {
                if (err) return next(err)
                if (existingMember) {
                    return sendError(res, 409, 'You are already an active member of this organization')
                }

                // Create OrganizationMember
                OrganizationMember.create({
                    role: invitation.role,
                    status: 'active',
                    joinedAt: new Date(),
                    isOwner: false,
                    organizationId: invitation.organizationId,
                    appuserId: req.userId,
                    subscriptionId: invitation.subscriptionId
                }, function (err, member) {
                    if (err) return next(err)

                    // Mark invitation as accepted
                    invitation.status = 'accepted'
                    invitation.save(function (err) {
                        if (err) return next(err)

                        res.json({
                            success: true,
                            membership: {
                                id: member.id,
                                role: member.role,
                                status: member.status,
                                joinedAt: member.joinedAt,
                                isOwner: member.isOwner,
                                organizationId: member.organizationId
                            }
                        })
                    })
                })
            })
        })
    })

    // ── GET /api/organizations/:orgId/members ──────────────────────────
    app.get(restRoot + '/organizations/:orgId/members', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId

        requireOrgAdmin(orgId, req.userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var OrganizationMember = app.models.OrganizationMember

            OrganizationMember.find({
                where: { organizationId: orgId, status: 'active' },
                include: 'user'
            }, function (err, members) {
                if (err) return next(err)

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

                res.json(result)
            })
        })
    })

    // ── GET /api/organizations/:orgId/invitations ──────────────────────
    app.get(restRoot + '/organizations/:orgId/invitations', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId

        requireOrgAdmin(orgId, req.userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var Invitation = app.models.invitation

            Invitation.find({
                where: { organizationId: orgId, status: 'pending' }
            }, function (err, invitations) {
                if (err) return next(err)

                res.json(invitations)
            })
        })
    })

    // ── PUT /api/organizations/:orgId/members/:memberId ────────────────
    app.put(restRoot + '/organizations/:orgId/members/:memberId', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId
        var memberId = req.params.memberId
        var body = req.body || {}
        var role = (body.role || '').trim().toLowerCase()

        if (role !== 'admin' && role !== 'member') {
            return sendError(res, 400, 'Role must be "admin" or "member"')
        }

        requireOrgAdmin(orgId, req.userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var OrganizationMember = app.models.OrganizationMember

            OrganizationMember.findById(memberId, function (err, member) {
                if (err) return next(err)
                if (!member) {
                    return sendError(res, 404, 'Member not found')
                }

                // Verify member belongs to this org
                if (String(member.organizationId) !== String(orgId)) {
                    return sendError(res, 404, 'Member not found in this organization')
                }

                // Protect owner
                if (member.isOwner) {
                    return sendError(res, 403, 'Cannot change the role of the subscription owner')
                }

                member.role = role
                member.save(function (err, updated) {
                    if (err) return next(err)

                    res.json({
                        success: true,
                        member: {
                            id: updated.id,
                            role: updated.role,
                            isOwner: updated.isOwner,
                            status: updated.status
                        }
                    })
                })
            })
        })
    })

    // ── DELETE /api/organizations/:orgId/members/:memberId ─────────────
    app.delete(restRoot + '/organizations/:orgId/members/:memberId', requireAuth, function (req, res, next) {
        var orgId = req.params.orgId
        var memberId = req.params.memberId

        requireOrgAdmin(orgId, req.userId, function (err) {
            if (err) return sendError(res, err.statusCode || 500, err.message)

            var OrganizationMember = app.models.OrganizationMember

            OrganizationMember.findById(memberId, function (err, member) {
                if (err) return next(err)
                if (!member) {
                    return sendError(res, 404, 'Member not found')
                }

                // Verify member belongs to this org
                if (String(member.organizationId) !== String(orgId)) {
                    return sendError(res, 404, 'Member not found in this organization')
                }

                // Protect owner
                if (member.isOwner) {
                    return sendError(res, 403, 'Cannot remove the subscription owner')
                }

                // Soft delete: set status to "removed"
                member.status = 'removed'
                member.save(function (err) {
                    if (err) return next(err)

                    res.json({
                        success: true,
                        message: 'Member has been removed from the organization'
                    })
                })
            })
        })
    })

    // ── Helpers ────────────────────────────────────────────────────────

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
