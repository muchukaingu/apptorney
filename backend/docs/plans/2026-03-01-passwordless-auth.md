# Passwordless Email OTP Auth with JWT — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace password-based auth with passwordless email OTP verification using JWT tokens.

**Architecture:** New boot script `auth-routes.js` handles `/api/auth/*` endpoints. JWT helper module signs/verifies tokens. AppUser model gains OTP fields. Existing `ask-ai-alias.js` switches from AccessToken DB lookups to stateless JWT verification. The Customer model's `firstName`/`lastName` are returned in auth responses.

**Tech Stack:** Node 8.11.3, LoopBack 3, jsonwebtoken (^8.5.1), bcryptjs (^2.4.3), Mailgun (existing), MongoDB Atlas (existing)

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install jsonwebtoken and bcryptjs**

Run:
```bash
cd "/Users/muchukaingu/Documents/1. Work/4. apptorney/Projects/Development/apptorney-backend"
npm install --save jsonwebtoken@8.5.1 bcryptjs@2.4.3
```

Note: `jsonwebtoken@8.5.1` supports Node 8. `bcryptjs` is a pure-JS bcrypt (no native compilation issues on Node 8) used for hashing OTPs.

**Step 2: Verify installation**

Run:
```bash
node -e "var jwt = require('jsonwebtoken'); var bcrypt = require('bcryptjs'); console.log('jwt ok, bcrypt ok')"
```

Expected: `jwt ok, bcrypt ok`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add jsonwebtoken and bcryptjs dependencies for passwordless auth"
```

---

### Task 2: Add OTP fields to AppUser model

**Files:**
- Modify: `common/models/appuser.json` (lines 15-18, add new properties)

**Step 1: Add OTP properties to appuser.json**

Add these properties after `currentSubscription` (line 18):

```json
"otpHash": {
    "type": "string"
},
"otpExpiry": {
    "type": "date"
},
"otpAttempts": {
    "type": "number",
    "default": 0
},
"otpLastSent": {
    "type": "date"
}
```

The full `properties` block should become:
```json
"properties": {
    "currentSubscription": {
        "type": "string"
    },
    "otpHash": {
        "type": "string"
    },
    "otpExpiry": {
        "type": "date"
    },
    "otpAttempts": {
        "type": "number",
        "default": 0
    },
    "otpLastSent": {
        "type": "date"
    }
}
```

**Step 2: Verify model loads**

Run:
```bash
node -e "var app = require('./server/server'); setTimeout(function() { var Appuser = app.models.appuser; console.log('Model properties:', Object.keys(Appuser.definition.properties)); process.exit(0); }, 3000)"
```

Expected: Properties list includes `otpHash`, `otpExpiry`, `otpAttempts`, `otpLastSent`

**Step 3: Commit**

```bash
git add common/models/appuser.json
git commit -m "feat: add OTP fields to AppUser model schema"
```

---

### Task 3: Create JWT helper module

**Files:**
- Create: `common/models/shared/jwt.js`

**Step 1: Create the JWT helper**

Create `common/models/shared/jwt.js` with this content:

```javascript
var jwt = require('jsonwebtoken')

var SECRET = process.env.JWT_SECRET || 'apptorney-jwt-secret-change-in-production'
var ACCESS_TOKEN_EXPIRY = '15m'
var REFRESH_TOKEN_EXPIRY = '30d'

module.exports.signAccessToken = function (userId, email) {
    return jwt.sign(
        { sub: String(userId), email: email, type: 'access' },
        SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
}

module.exports.signRefreshToken = function (userId) {
    return jwt.sign(
        { sub: String(userId), type: 'refresh' },
        SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    )
}

module.exports.verifyAccessToken = function (token) {
    try {
        var decoded = jwt.verify(token, SECRET)
        if (decoded.type !== 'access') {
            return null
        }
        return decoded
    } catch (err) {
        return null
    }
}

module.exports.verifyRefreshToken = function (token) {
    try {
        var decoded = jwt.verify(token, SECRET)
        if (decoded.type !== 'refresh') {
            return null
        }
        return decoded
    } catch (err) {
        return null
    }
}
```

**Step 2: Verify module loads**

Run:
```bash
node -e "var jwtHelper = require('./common/models/shared/jwt'); var at = jwtHelper.signAccessToken('abc123', 'test@test.com'); var rt = jwtHelper.signRefreshToken('abc123'); console.log('access:', at.split('.').length === 3 ? 'valid JWT' : 'INVALID'); console.log('refresh:', rt.split('.').length === 3 ? 'valid JWT' : 'INVALID'); var decoded = jwtHelper.verifyAccessToken(at); console.log('decoded sub:', decoded.sub); console.log('decoded type:', decoded.type)"
```

Expected:
```
access: valid JWT
refresh: valid JWT
decoded sub: abc123
decoded type: access
```

**Step 3: Commit**

```bash
git add common/models/shared/jwt.js
git commit -m "feat: add JWT sign/verify helper module"
```

---

### Task 4: Add OTP email template to mail helper

**Files:**
- Modify: `common/models/shared/mail.js` (add `sendOtpEmail` function)

**Step 1: Add sendOtpEmail function**

Append to `common/models/shared/mail.js` after the existing `sendEmail` export:

```javascript
module.exports.sendOtpEmail = function (recipient, otp) {
  var DOMAIN = "mg.apptorney.org";
  var mg = mailgun({
    apiKey: "bb9112c75588d7294dddd31c539df299-77751bfc-f4281491",
    domain: DOMAIN
  });
  var data = {
    from: "Apptorney <postmaster@mg.apptorney.org>",
    to: recipient,
    subject: "Your Apptorney verification code",
    text: "Your verification code is: " + otp + "\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\n- The Apptorney Team"
  };

  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log("OTP email error:", error);
    }
  });
};
```

Note: This uses a plain-text email rather than a Mailgun template. Simple and reliable. If a branded template `otp` exists in Mailgun later, we can switch to it.

**Step 2: Commit**

```bash
git add common/models/shared/mail.js
git commit -m "feat: add OTP email sender to mail helper"
```

---

### Task 5: Create auth routes boot script

**Files:**
- Create: `server/boot/auth-routes.js`

This is the core task. The boot script registers four POST endpoints under `/api/auth/`.

**Step 1: Create the auth routes boot script**

Create `server/boot/auth-routes.js` with the following content:

```javascript
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

        // Generate 6-digit OTP
        var otp = String(Math.floor(100000 + Math.random() * 900000))

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
```

**Step 2: Verify boot script loads**

Run:
```bash
node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server booted OK'); process.exit(0); }, 5000)"
```

Expected: `Server booted OK` (no crash)

**Step 3: Commit**

```bash
git add server/boot/auth-routes.js
git commit -m "feat: add passwordless auth endpoints (register, login, verify-otp, refresh)"
```

---

### Task 6: Update ask-ai-alias.js to use JWT

**Files:**
- Modify: `server/boot/ask-ai-alias.js` (replace `resolveAccessToken` function)

**Step 1: Replace token resolution with JWT verification**

Replace the `extractTokenId` and `resolveAccessToken` functions (lines 9-80) with JWT-based resolution. The handler function (line 82 onwards) stays the same but the token check changes.

Replace lines 9-31 (`extractTokenId` function) with:

```javascript
    var jwtHelper = require('../../common/models/shared/jwt')

    function extractBearerToken(req) {
        var authHeader = req.headers && (req.headers.authorization || req.headers.Authorization)
        if (typeof authHeader === 'string') {
            var match = authHeader.match(/^Bearer\s+(.+)$/i)
            if (match && match[1]) {
                return match[1].trim()
            }
        }
        return ''
    }
```

Replace lines 33-80 (`resolveAccessToken` function) with:

```javascript
    function resolveAccessToken(req, cb) {
        var token = extractBearerToken(req)
        if (!token) {
            cb(null, null)
            return
        }

        var decoded = jwtHelper.verifyAccessToken(token)
        if (!decoded) {
            cb(null, null)
            return
        }

        // Set userId on a token-like object for compatibility with handler
        cb(null, { userId: decoded.sub, email: decoded.email })
    }
```

**Step 2: Verify the server still boots and the endpoint rejects unauthenticated requests**

Run:
```bash
node -e "var app = require('./server/server'); setTimeout(function() { console.log('Server booted OK'); process.exit(0); }, 5000)"
```

Expected: `Server booted OK`

**Step 3: Commit**

```bash
git add server/boot/ask-ai-alias.js
git commit -m "feat: switch ask-ai auth from AccessToken DB lookups to JWT verification"
```

---

### Task 7: Add JWT_SECRET to ECS environment

**Files:**
- No code files — ECS task definition update

**Step 1: Generate a strong secret**

Run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Save the output — this is the `JWT_SECRET`.

**Step 2: Register updated task definition with JWT_SECRET**

Fetch current task definition, add `JWT_SECRET` to the environment array, and register a new revision. Follow the same process as the deployment skill:

1. `aws ecs describe-task-definition --task-definition Apptorney-Prod-Runtask --region eu-west-2`
2. Add `{ "name": "JWT_SECRET", "value": "<generated-secret>" }` to the container's `environment` array
3. Register new task definition revision
4. The next deploy will pick it up automatically

**Step 3: Commit (no code changes — document the env var)**

No git commit needed for this step. The env var is set in ECS, not in code.

---

### Task 8: Test the full flow end-to-end

**No files to modify — manual testing.**

**Step 1: Start the server locally**

Run:
```bash
JWT_SECRET=test-secret-for-dev node .
```

**Step 2: Test registration**

Run:
```bash
curl -s -X POST http://localhost:3005/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}' | node -e "process.stdin.on('data',function(d){var r=JSON.parse(d);console.log(r.success?'PASS: '+r.message:'FAIL: '+JSON.stringify(r))})"
```

Expected: `PASS: Verification code sent to test@example.com`

**Step 3: Test login**

Run:
```bash
curl -s -X POST http://localhost:3005/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}' | node -e "process.stdin.on('data',function(d){var r=JSON.parse(d);console.log(r.success?'PASS: '+r.message:'FAIL: '+JSON.stringify(r))})"
```

Expected: `PASS: Verification code sent to test@example.com`

**Step 4: Test verify-otp (requires checking email or DB for OTP)**

To test without real email, query MongoDB directly for the user's `otpHash` and use a known OTP by temporarily logging it:

```bash
# Check the server console output for the OTP, or query the DB:
node -e "
var app = require('./server/server');
setTimeout(function() {
  var Appuser = app.models.appuser;
  Appuser.findOne({ where: { email: 'test@example.com' }}, function(err, u) {
    console.log('otpExpiry:', u.otpExpiry);
    console.log('otpHash exists:', !!u.otpHash);
    process.exit(0);
  });
}, 3000)
"
```

**Step 5: Test refresh**

```bash
curl -s -X POST http://localhost:3005/api/auth/refresh \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken":"<refresh-token-from-verify-otp>"}' | node -e "process.stdin.on('data',function(d){var r=JSON.parse(d);console.log(r.accessToken?'PASS: got new access token':'FAIL: '+JSON.stringify(r))})"
```

Expected: `PASS: got new access token`

**Step 6: Test ask-ai with JWT**

```bash
curl -s -X POST http://localhost:3005/api/ask-ai \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <access-token-from-verify-otp>' \
  -d '{"question":"What is the Constitution of Zambia?"}' | head -c 200
```

Expected: A JSON response (not a 401 error)

---

### Task 9: Deploy

**Step 1: Build and push Docker image**

Follow the deploy skill at `~/.claude/skills/deploy-apptorney-backend/SKILL.md`.

Tag: `passwordless-auth`

**Step 2: Register new task definition with JWT_SECRET env var (from Task 7)**

**Step 3: Update ECS service**

**Step 4: Monitor deployment**

---

## Summary of all files

| Action | File |
|--------|------|
| Modify | `package.json` (add jsonwebtoken, bcryptjs) |
| Modify | `common/models/appuser.json` (add OTP fields) |
| Create | `common/models/shared/jwt.js` (JWT helpers) |
| Modify | `common/models/shared/mail.js` (add sendOtpEmail) |
| Create | `server/boot/auth-routes.js` (auth endpoints) |
| Modify | `server/boot/ask-ai-alias.js` (JWT verification) |
| Config | ECS task definition (add JWT_SECRET env var) |
