import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BillingCycle, OrgInvitation, OrgMember, PricingPlan, Subscription, SubscriptionStatus } from '../models/subscription.models';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private readonly api: ApiService) {}

  async getPricing(): Promise<{ ok: boolean; plans: PricingPlan[] }> {
    const response = await this.api.request('/subscriptions/pricing', { skipAuthHeader: true });
    if (!response.ok) {
      return { ok: false, plans: [] };
    }
    const data = response.data as any;

    // If backend returns plans as an array, use directly
    if (Array.isArray(data?.plans)) {
      return { ok: true, plans: data.plans };
    }
    if (Array.isArray(data)) {
      return { ok: true, plans: data };
    }

    // Map the backend's { pricing: { plan_key: { monthly, annual } } } format
    const pricing = data?.pricing;
    if (pricing && typeof pricing === 'object') {
      const planMap: Record<string, { name: string; type: 'individual' | 'organization'; features: string[] }> = {
        b2c_standard: { name: 'Standard', type: 'individual', features: ['Unlimited AI queries', 'Full case law access', 'Legislation library'] },
        b2b_per_user: { name: 'Organization', type: 'organization', features: ['Everything in Standard', 'Team management', 'Per-user billing'] }
      };
      const plans: PricingPlan[] = Object.entries(pricing).map(([key, prices]: [string, any]) => ({
        id: key,
        name: planMap[key]?.name ?? key,
        type: planMap[key]?.type ?? 'individual',
        monthlyPrice: prices?.monthly ?? 0,
        yearlyPrice: prices?.annual ?? prices?.yearly ?? 0,
        features: planMap[key]?.features ?? []
      }));
      return { ok: true, plans };
    }

    return { ok: true, plans: [] };
  }

  async subscribe(planId: string, billingCycle: BillingCycle, organizationName?: string): Promise<{ ok: boolean; subscription?: Subscription; message?: string }> {
    // Backend expects { plan, billingPeriod } with 'annual' instead of 'yearly'
    const body: any = {
      plan: planId,
      billingPeriod: billingCycle === 'yearly' ? 'annual' : billingCycle
    };
    if (organizationName) {
      body.organizationName = organizationName;
    }
    const response = await this.api.request('/subscriptions/subscribe', { method: 'POST', body });
    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.error?.message || data?.message || response.errorMessage || 'Subscription failed.' };
    }
    const data = response.data as any;
    const sub = data?.subscription || data;
    return { ok: true, subscription: this.mapSubscription(sub) };
  }

  async getMySubscription(): Promise<{ ok: boolean; subscription?: Subscription }> {
    const response = await this.api.request('/subscriptions/mine');
    if (!response.ok) {
      return { ok: false };
    }
    const data = response.data as any;
    const sub = data?.subscription;
    return { ok: true, subscription: sub ? this.mapSubscription(sub) : undefined };
  }

  async getSubscriptionStatus(): Promise<{ ok: boolean; status?: SubscriptionStatus }> {
    // Backend has no /subscriptions/status endpoint — use /subscriptions/mine and derive status
    const response = await this.api.request('/subscriptions/mine');
    if (!response.ok) {
      return { ok: false };
    }
    const data = response.data as any;
    const sub = data?.subscription;

    if (!sub) {
      return { ok: true, status: { isActive: false, subscription: null, daysRemaining: 0 } };
    }

    const mapped = this.mapSubscription(sub);
    const isActive = sub.status === 'active';
    const isPending = sub.status === 'pending';
    let daysRemaining = 0;
    if (sub.expiryDate) {
      daysRemaining = Math.max(0, Math.ceil((new Date(sub.expiryDate).getTime() - Date.now()) / 86400000));
    }

    return {
      ok: true,
      status: {
        isActive: isActive || isPending,
        subscription: mapped,
        daysRemaining
      }
    };
  }

  async confirmPayment(subscriptionId: string, amount: number, method: string, reference: string): Promise<{ ok: boolean; message?: string }> {
    // Backend endpoint is /payments/confirm, not /subscriptions/confirm-payment
    const response = await this.api.request('/payments/confirm', {
      method: 'POST',
      body: { subscriptionId, amount, method, reference }
    });
    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.error?.message || data?.message || response.errorMessage || 'Payment confirmation failed.' };
    }
    const data = response.data as any;
    return { ok: true, message: data?.message || 'Payment confirmed successfully.' };
  }

  // Organization methods

  async inviteMember(orgId: string, email: string): Promise<{ ok: boolean; message?: string }> {
    const response = await this.api.request(`/organizations/${orgId}/invite`, {
      method: 'POST',
      body: { email }
    });
    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.message || 'Invite failed.' };
    }
    const data = response.data as any;
    return { ok: true, message: data?.message };
  }

  async acceptInvitation(token: string): Promise<{ ok: boolean; message?: string }> {
    // Backend endpoint is /invitations/:token/accept
    const response = await this.api.request(`/invitations/${encodeURIComponent(token)}/accept`, {
      method: 'POST'
    });
    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.error?.message || data?.message || 'Accepting invitation failed.' };
    }
    const data = response.data as any;
    return { ok: true, message: data?.message };
  }

  async getMembers(orgId: string): Promise<{ ok: boolean; members: OrgMember[] }> {
    const response = await this.api.request(`/organizations/${orgId}/members`);
    if (!response.ok) {
      return { ok: false, members: [] };
    }
    const data = response.data as any;
    return { ok: true, members: Array.isArray(data) ? data : data?.members || [] };
  }

  async getInvitations(orgId: string): Promise<{ ok: boolean; invitations: OrgInvitation[] }> {
    const response = await this.api.request(`/organizations/${orgId}/invitations`);
    if (!response.ok) {
      return { ok: false, invitations: [] };
    }
    const data = response.data as any;
    return { ok: true, invitations: Array.isArray(data) ? data : data?.invitations || [] };
  }

  async updateMemberRole(orgId: string, memberId: string, role: string): Promise<{ ok: boolean }> {
    const response = await this.api.request(`/organizations/${orgId}/members/${memberId}/role`, {
      method: 'PUT',
      body: { role }
    });
    return { ok: response.ok };
  }

  async removeMember(orgId: string, memberId: string): Promise<{ ok: boolean }> {
    const response = await this.api.request(`/organizations/${orgId}/members/${memberId}`, {
      method: 'DELETE'
    });
    return { ok: response.ok };
  }

  /** Map backend subscription fields to frontend Subscription model */
  private mapSubscription(sub: any): Subscription {
    return {
      id: sub.id || sub._id || '',
      planId: sub.plan || sub.planId || '',
      planName: sub.plan === 'b2c_standard' ? 'Standard' : sub.plan === 'b2b_per_user' ? 'Organization' : (sub.planName || sub.plan || ''),
      status: sub.status || '',
      billingCycle: sub.billingPeriod === 'annual' ? 'yearly' : (sub.billingPeriod || sub.billingCycle || 'monthly'),
      startDate: sub.activationDate || sub.startDate || sub.createdAt || '',
      endDate: sub.expiryDate || sub.endDate || '',
      organizationName: sub.organizationName,
      organizationId: sub.organizationId
    };
  }
}
