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
