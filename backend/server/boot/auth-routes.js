var bcrypt = require('bcryptjs')
var jwtHelper = require('../../common/models/shared/jwt')
var mail = require('../../common/models/shared/mail')

var OTP_EXPIRY_MS = 10 * 60 * 1000    // 10 minutes
var OTP_COOLDOWN_MS = 60 * 1000       // 1 minute between sends
var OTP_MAX_ATTEMPTS = 5

module.exports = function (app) {
    var restRoot = app.get('restApiRoot') || '/api'

    // ── POST /api/auth/register ──────────────────────────────────────
    app.post(restRoot + '/auth/register', function (req, res, next) {
        var body = req.body || {}
        var email = (body.email || '').trim().toLowerCase()
        var firstName = (body.firstName || '').trim()
        var lastName = (body.lastName || '').trim()

        if (!email) {
            return sendError(res, 400, 'Email is required')
        }
        if (!firstName || !lastName) {
            return sendError(res, 400, 'First name and last name are required')
        }

        var Appuser = app.models.appuser || app.models.Appuser
        var Customer = app.models.Customer

        // Check if user already exists
        Appuser.findOne({ where: { email: email } }, function (err, existing) {
            if (err) return next(err)
            if (existing) {
                return sendError(res, 409, 'An account with this email already exists')
            }

            // Create AppUser with a random password (required by LoopBack User base model)
            var randomPassword = require('crypto').randomBytes(32).toString('hex')
            Appuser.create({
                email: email,
                username: email,
                password: randomPassword,
                firstname: firstName,
                lastname: lastName,
                emailVerified: false,
                phoneVerified: true  // We no longer require phone verification
            }, function (err, user) {
                if (err) {
                    if (err.statusCode === 422 || (err.details && err.details.codes)) {
                        return sendError(res, 409, 'An account with this email already exists')
                    }
                    return next(err)
                }

                // Create linked Customer record
                Customer.create({
                    firstName: firstName,
                    lastName: lastName,
                    emailAddress: email,
                    phoneNumber: email,  // Use email as placeholder since phone is no longer primary
                    appuserId: user.id
                }, function (custErr) {
                    if (custErr) {
                        console.log('Warning: Customer creation failed:', custErr.message)
                        // Don't fail registration if customer creation fails
                    }

                    // Generate and send OTP
                    generateAndSendOtp(user, email, function (otpErr) {
                        if (otpErr) return next(otpErr)
                        res.json({
                            success: true,
                            message: 'Verification code sent to ' + email
                        })
                    })
                })
            })
        })
    })

    // ── POST /api/auth/login ─────────────────────────────────────────
    app.post(restRoot + '/auth/login', function (req, res, next) {
        var body = req.body || {}
        var email = (body.email || '').trim().toLowerCase()

        if (!email) {
            return sendError(res, 400, 'Email is required')
        }

        var Appuser = app.models.appuser || app.models.Appuser

        Appuser.findOne({ where: { email: email } }, function (err, user) {
            if (err) return next(err)
            if (!user) {
                return sendError(res, 404, 'No account found with this email')
            }

            generateAndSendOtp(user, email, function (otpErr) {
                if (otpErr) return next(otpErr)
                res.json({
                    success: true,
                    message: 'Verification code sent to ' + email
                })
            })
        })
    })

    // ── POST /api/auth/verify-otp ────────────────────────────────────
    app.post(restRoot + '/auth/verify-otp', function (req, res, next) {
        var body = req.body || {}
        var email = (body.email || '').trim().toLowerCase()
        var otp = String(body.otp || '').trim()

        if (!email || !otp) {
            return sendError(res, 400, 'Email and OTP are required')
        }

        var Appuser = app.models.appuser || app.models.Appuser
        var Customer = app.models.Customer

        Appuser.findOne({ where: { email: email } }, function (err, user) {
            if (err) return next(err)
            if (!user) {
                return sendError(res, 404, 'No account found with this email')
            }

            // Check OTP expiry
            if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
                return sendError(res, 400, 'Verification code has expired. Please request a new one.')
            }

            // Check attempts
            if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
                return sendError(res, 429, 'Too many attempts. Please request a new verification code.')
            }

            // Verify OTP hash
            bcrypt.compare(otp, user.otpHash, function (bcryptErr, isMatch) {
                if (bcryptErr) return next(bcryptErr)

                if (!isMatch) {
                    // Increment attempts
                    user.otpAttempts = (user.otpAttempts || 0) + 1
                    user.save(function () {
                        sendError(res, 401, 'Invalid verification code')
                    })
                    return
                }

                // OTP is valid — clear OTP fields, mark verified
                user.otpHash = null
                user.otpExpiry = null
                user.otpAttempts = 0
                user.emailVerified = true
                user.lastLogin = new Date()
                user.save(function (saveErr) {
                    if (saveErr) return next(saveErr)

                    // Look up Customer for full name
                    Customer.findOne({ where: { appuserId: user.id } }, function (custErr, customer) {
                        var firstName = ''
                        var lastName = ''
                        if (customer) {
                            firstName = customer.firstName || ''
                            lastName = customer.lastName || ''
                        } else {
                            // Fallback to AppUser fields
                            firstName = user.firstname || ''
                            lastName = user.lastname || ''
                        }

                        var accessToken = jwtHelper.signAccessToken(user.id, email)
                        var refreshToken = jwtHelper.signRefreshToken(user.id)

                        res.json({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            user: {
                                id: user.id,
                                firstName: firstName,
                                lastName: lastName,
                                email: email
                            }
                        })
                    })
                })
            })
        })
    })

    // ── POST /api/auth/refresh ───────────────────────────────────────
    app.post(restRoot + '/auth/refresh', function (req, res, next) {
        var body = req.body || {}
        var refreshToken = body.refreshToken

        if (!refreshToken) {
            return sendError(res, 400, 'Refresh token is required')
        }

        var decoded = jwtHelper.verifyRefreshToken(refreshToken)
        if (!decoded) {
            return sendError(res, 401, 'Invalid or expired refresh token')
        }

        var Appuser = app.models.appuser || app.models.Appuser
        Appuser.findById(decoded.sub, function (err, user) {
            if (err) return next(err)
            if (!user) {
                return sendError(res, 401, 'User not found')
            }

            var accessToken = jwtHelper.signAccessToken(user.id, user.email)
            res.json({ accessToken: accessToken })
        })
    })

    // ── Helpers ──────────────────────────────────────────────────────

    function generateAndSendOtp(user, email, cb) {
        // Rate limit check
        if (user.otpLastSent) {
            var elapsed = Date.now() - new Date(user.otpLastSent).getTime()
            if (elapsed < OTP_COOLDOWN_MS) {
                var waitSec = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000)
                var err = new Error('Please wait ' + waitSec + ' seconds before requesting a new code')
                err.statusCode = 429
                return cb(err)
            }
        }

        // Generate 6-digit OTP (cryptographically secure)
        var crypto = require('crypto')
        var otp = String(crypto.randomBytes(4).readUInt32BE(0) % 900000 + 100000)

        // Hash it
        bcrypt.hash(otp, 10, function (hashErr, hash) {
            if (hashErr) return cb(hashErr)

            user.otpHash = hash
            user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS)
            user.otpAttempts = 0
            user.otpLastSent = new Date()
            user.save(function (saveErr) {
                if (saveErr) return cb(saveErr)

                // Send email
                mail.sendOtpEmail(email, otp)
                cb(null)
            })
        })
    }

    function sendError(res, statusCode, message) {
        res.status(statusCode).json({
            error: { statusCode: statusCode, message: message }
        })
    }
}
