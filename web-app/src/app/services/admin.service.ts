import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AdminContent, AdminOverview, AdminPayment, AdminSubscriptionBreakdown, GrowthDataPoint } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly api: ApiService) {}

  async getOverview(): Promise<{ ok: boolean; data?: AdminOverview }> {
    const response = await this.api.request('/admin/overview');
    if (!response.ok) {
      return { ok: false };
    }
    return { ok: true, data: response.data as AdminOverview };
  }

  async getGrowth(period = 30): Promise<{ ok: boolean; data?: GrowthDataPoint[] }> {
    const response = await this.api.request('/admin/growth', { query: { period } });
    if (!response.ok) {
      return { ok: false };
    }
    const data = response.data as any;
    return { ok: true, data: Array.isArray(data) ? data : data?.data || [] };
  }

  async getSubscriptions(): Promise<{ ok: boolean; data?: AdminSubscriptionBreakdown[] }> {
    const response = await this.api.request('/admin/subscriptions');
    if (!response.ok) {
      return { ok: false };
    }
    const data = response.data as any;
    return { ok: true, data: Array.isArray(data) ? data : data?.data || [] };
  }

  async getPayments(page = 1, limit = 20): Promise<{ ok: boolean; data?: AdminPayment[]; total?: number }> {
    const response = await this.api.request('/admin/payments', { query: { page, limit } });
    if (!response.ok) {
      return { ok: false };
    }
    const data = response.data as any;
    return {
      ok: true,
      data: Array.isArray(data?.payments) ? data.payments : Array.isArray(data) ? data : [],
      total: data?.total ?? 0
    };
  }

  async getContent(): Promise<{ ok: boolean; data?: AdminContent }> {
    const response = await this.api.request('/admin/content');
    if (!response.ok) {
      return { ok: false };
    }
    return { ok: true, data: response.data as AdminContent };
  }
}
