# Passwordless Email OTP Auth with JWT

## Overview

Replace password-based auth with passwordless email OTP verification, using JWT tokens instead of LoopBack AccessTokens.

## User Flows

### Register
1. `POST /api/auth/register` — `{ firstName, lastName, email }`
2. Server creates AppUser (unverified) + linked Customer, generates 6-digit OTP, stores OTP hash + expiry, sends OTP to email via Mailgun
3. `POST /api/auth/verify-otp` — `{ email, otp }`
4. Server validates OTP, marks emailVerified: true, returns `{ accessToken, refreshToken, user: { id, firstName, lastName, email } }`

### Login (returning user)
1. `POST /api/auth/login` — `{ email }`
2. Server generates 6-digit OTP, stores OTP hash + expiry, sends to email
3. `POST /api/auth/verify-otp` — `{ email, otp }`
4. Server validates OTP, returns `{ accessToken, refreshToken, user: { id, firstName, lastName, email } }`

### Token Refresh
1. `POST /api/auth/refresh` — `{ refreshToken }`
2. Server verifies refresh token signature, returns new `{ accessToken }`

## Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/register` | No | Create account + send OTP |
| POST | `/api/auth/login` | No | Send OTP to existing user |
| POST | `/api/auth/verify-otp` | No | Verify OTP, return JWT tokens + user name |
| POST | `/api/auth/refresh` | No | Get new access token |

## JWT Structure

Access Token (15 min): `{ sub: userId, email, type: "access", iat, exp }`
Refresh Token (30 days): `{ sub: userId, type: "refresh", iat, exp }`
Signed with JWT_SECRET env var using HS256.

## OTP Details
- 6-digit numeric code
- Stored as bcrypt hash on user record
- Expires in 10 minutes
- Max 5 attempts before OTP invalidated
- Rate limit: max 1 OTP per 60 seconds per email

## Auth Middleware
- New boot script replaces current token resolution
- Extracts JWT from Authorization: Bearer header
- Verifies signature and expiry
- Attaches req.userId and req.userEmail for downstream use
- ask-ai-alias.js updated to use JWT instead of AccessToken lookups

## Files to Create/Modify
- Create: `server/boot/auth-routes.js` — auth endpoints
- Create: `common/models/shared/jwt.js` — JWT sign/verify helpers
- Modify: `common/models/appuser.json` — add otpHash, otpExpiry, otpAttempts, otpLastSent
- Modify: `server/boot/ask-ai-alias.js` — switch to JWT verification
- Modify: `common/models/shared/mail.js` — add OTP email template
- Add: jsonwebtoken npm dependency
