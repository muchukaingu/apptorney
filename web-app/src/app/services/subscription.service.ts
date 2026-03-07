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
    return { ok: true, plans: Array.isArray(data?.plans) ? data.plans : Array.isArray(data) ? data : [] };
  }

  async subscribe(planId: string, billingCycle: BillingCycle, organizationName?: string): Promise<{ ok: boolean; subscription?: Subscription; message?: string }> {
    const body: any = { planId, billingCycle };
    if (organizationName) {
      body.organizationName = organizationName;
    }
    const response = await this.api.request('/subscriptions/subscribe', { method: 'POST', body });
    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.message || response.errorMessage || 'Subscription failed.' };
    }
    const data = response.data as any;
    return { ok: true, subscription: data?.subscription || data };
  }

  async getMySubscription(): Promise<{ ok: boolean; subscription?: Subscription }> {
    const response = await this.api.request('/subscriptions/mine');
    if (!response.ok) {
      return { ok: false };
    }
    const data = response.data as any;
    return { ok: true, subscription: data?.subscription || data };
  }

  async getSubscriptionStatus(): Promise<{ ok: boolean; status?: SubscriptionStatus }> {
    const response = await this.api.request('/subscriptions/status');
    if (!response.ok) {
      return { ok: false };
    }
    const data = response.data as any;
    return { ok: true, status: data };
  }

  async confirmPayment(subscriptionId: string, amount: number, method: string, reference: string): Promise<{ ok: boolean; message?: string }> {
    const response = await this.api.request('/subscriptions/confirm-payment', {
      method: 'POST',
      body: { subscriptionId, amount, method, reference }
    });
    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.message || response.errorMessage || 'Payment confirmation failed.' };
    }
    const data = response.data as any;
    return { ok: true, message: data?.message };
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
    const response = await this.api.request('/organizations/accept-invitation', {
      method: 'POST',
      body: { token }
    });
    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.message || 'Accepting invitation failed.' };
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
}
