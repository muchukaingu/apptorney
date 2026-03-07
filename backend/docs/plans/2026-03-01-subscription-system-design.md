# Subscription System Design — B2B & B2C

**Date**: 2026-03-01
**Status**: Approved
**Approach**: Extend existing models (Approach A)

## Summary

Add subscription functionality supporting both B2C (individual, single flat-rate plan) and B2B (organization, per-user pricing) models. Payment is manual for this phase, with a deferred TODO for payment gateway integration (Stripe/PayStack/DPO).

Key decisions:
- No free trial (users already have free functionality)
- B2C: single plan, monthly or annual billing
- B2B: single per-user price, monthly or annual billing
- B2B admin invites users via email invite link
- Subscription owner is protected (cannot be removed or demoted)

## Data Models

### Subscription (reworked from existing)

```
Subscription {
  id: ObjectId
  type: string          // "individual" | "organization"
  plan: string          // "b2c_standard" | "b2b_per_user"
  billingPeriod: string // "monthly" | "annual"
  status: string        // "pending" | "active" | "expired" | "cancelled"
  pricePerUser: number  // For B2B: per seat; For B2C: the flat rate
  maxUsers: number      // 1 for B2C; variable for B2B
  activationDate: date
  expiryDate: date
  autoRenew: boolean

  belongsTo: Appuser (owner)
  belongsTo: Organization (nullable, B2B only)
  hasMany: Payment
}
```

### OrganizationMember (new)

```
OrganizationMember {
  id: ObjectId
  role: string          // "admin" | "member"
  status: string        // "active" | "suspended" | "removed"
  joinedAt: date

  belongsTo: Organization
  belongsTo: Appuser
  belongsTo: Subscription
}
```

### Invitation (new)

```
Invitation {
  id: ObjectId
  email: string
  token: string         // unique invite token
  role: string          // "admin" | "member" (default: "member")
  status: string        // "pending" | "accepted" | "expired" | "cancelled"
  expiresAt: date       // 7-day expiry

  belongsTo: Organization
  belongsTo: Appuser (invitedBy)
  belongsTo: Subscription
}
```

### Organization (enhanced)

Add relations:
- hasMany: OrganizationMember
- hasMany: Invitation
- hasOne: Subscription

### Payment (enhanced from existing)

```
Payment {
  id: ObjectId
  date: date
  amount: number
  method: string        // "manual" for now
  status: string        // "pending" | "confirmed" | "failed"
  reference: string     // e.g., bank transfer reference
  notes: string

  belongsTo: Subscription
  belongsTo: Appuser (paidBy)
}
```

## API Endpoints

### Subscription

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/subscriptions/subscribe` | Authenticated | Create a subscription (B2C or B2B) |
| GET | `/api/subscriptions/mine` | Authenticated | Get current user's subscription |
| GET | `/api/subscriptions/:id/status` | Authenticated | Check subscription status |

### Payments (Manual)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/confirm` | System admin | Confirm payment and activate subscription |

### Organization Management (B2B)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/organizations/:orgId/invite` | Org admin | Send invite email to new user |
| POST | `/api/invitations/:token/accept` | Authenticated | Accept an invitation |
| GET | `/api/organizations/:orgId/members` | Org admin | List all members |
| PUT | `/api/organizations/:orgId/members/:memberId` | Org admin | Update member role |
| DELETE | `/api/organizations/:orgId/members/:memberId` | Org admin | Remove member |

## Flows

### B2C Subscription Flow

1. User calls `POST /api/subscriptions/subscribe` with `{ plan: "b2c_standard", billingPeriod }`
2. Subscription created with `status: "pending"`, `maxUsers: 1`
3. User makes payment outside the system
4. System admin calls `POST /api/payments/confirm` to record payment
5. Subscription activates: `status: "active"`, `expiryDate` set

### B2B Subscription Flow

1. User calls `POST /api/subscriptions/subscribe` with `{ plan: "b2b_per_user", billingPeriod, organizationName, maxUsers }`
2. Organization created (if not exists)
3. Subscription created with `status: "pending"`, linked to organization
4. OrganizationMember created with `role: "admin"` for the subscribing user
5. System admin confirms payment → subscription activates
6. Admin invites users via `POST /api/organizations/:orgId/invite`
7. Invited users click email link → `POST /api/invitations/:token/accept`

### Invitation Flow

1. Admin calls invite endpoint with email and role
2. System validates: invitation not duplicate, seats available (`currentMembers < maxUsers`)
3. Invitation created with unique token, 7-day expiry
4. Email sent with invite link
5. Recipient registers/logs in, calls accept endpoint
6. OrganizationMember created, invitation marked as accepted

## Authorization

### Roles

- **Subscription Owner**: Cannot be removed or demoted. Always retains admin. Is the billing contact.
- **Organization Admin**: Can invite/remove users, assign admin role, view all members.
- **Organization Member**: Can view own membership, leave organization, access subscription features.

### Access Checks

```
requireOrgAdmin(orgId):
  1. Verify JWT → userId
  2. Find OrganizationMember where userId + orgId + role = "admin"
  3. Not found → 403

requireActiveSubscription():
  1. Get user's subscription (direct for B2C, via OrganizationMember for B2B)
  2. Check status === "active" && expiryDate > now
  3. Invalid → 403
```

## Payment — Manual Phase

- Subscription created with `status: "pending"`
- User pays outside system (bank transfer, mobile money, etc.)
- System admin confirms via `POST /api/payments/confirm`
- Payment record created, subscription activated
- Expiry calculated: monthly = +30 days, annual = +365 days

### TODO: Payment Gateway Integration

```
// TODO: Integrate payment gateway (Stripe/PayStack/DPO)
// - Replace manual confirmation with webhook-based activation
// - Add: POST /api/payments/initiate, POST /api/payments/webhook
// - Support card payments, mobile money
// - Auto-activate on successful payment
// - Auto-renew with stored payment method
// - Invoice generation
```

## Files to Create/Modify

### New Files
- `common/models/organization-member.json` + `.js`
- `common/models/invitation.json` + `.js`
- `server/boot/subscription-routes.js` (subscription + payment endpoints)
- `server/boot/organization-routes.js` (org management endpoints)
- `common/models/shared/subscription-helpers.js` (shared logic)

### Modified Files
- `common/models/subscription.json` — rework schema
- `common/models/subscription.js` — rework logic
- `common/models/payment.json` — add relations and fields
- `common/models/payment.js` — add confirmation logic
- `common/models/Organization.json` — add new relations
- `server/model-config.json` — register new models
