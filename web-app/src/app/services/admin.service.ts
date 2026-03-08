import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AdminContent, AdminOverview, AdminPayment, AdminSubscriptionBreakdown, GrowthDataPoint } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly api: ApiService) {}

  async getOverview(): Promise<{ ok: boolean; data?: AdminOverview }> {
    const response = await this.api.request('/admin/stats/overview', { timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }
    const raw = response.data as any;
    return {
      ok: true,
      data: {
        totalUsers: raw?.users?.total ?? 0,
        activeSubscriptions: raw?.subscriptions?.active ?? 0,
        monthlyRevenue: raw?.revenue?.thisMonth ?? 0,
        totalQueries: raw?.ai?.queriesToday ?? 0
      }
    };
  }

  async getGrowth(period = 30): Promise<{ ok: boolean; data?: GrowthDataPoint[] }> {
    const periodParam = period <= 30 ? '30d' : period <= 90 ? '90d' : period <= 365 ? '1y' : 'all';
    const response = await this.api.request('/admin/stats/growth', { query: { period: periodParam }, timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }
    const raw = response.data as any;
    const dataPoints: any[] = raw?.dataPoints || [];
    return {
      ok: true,
      data: dataPoints.map(dp => ({
        date: dp.date,
        newUsers: dp.newUsers ?? 0,
        queries: dp.aiQueries ?? 0,
        revenue: dp.dailyRevenue ?? 0
      }))
    };
  }

  async getSubscriptions(): Promise<{ ok: boolean; data?: AdminSubscriptionBreakdown[] }> {
    const response = await this.api.request('/admin/stats/subscriptions', { timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }
    const raw = response.data as any;
    const breakdowns: AdminSubscriptionBreakdown[] = [];
    if (raw?.byPlan) {
      for (const [plan, count] of Object.entries(raw.byPlan)) {
        breakdowns.push({ plan, status: 'by-plan', count: count as number });
      }
    }
    if (raw?.byStatus) {
      for (const [status, count] of Object.entries(raw.byStatus)) {
        breakdowns.push({ plan: 'all', status, count: count as number });
      }
    }
    return { ok: true, data: breakdowns };
  }

  async getPayments(page = 1, limit = 20): Promise<{ ok: boolean; data?: AdminPayment[]; total?: number }> {
    const response = await this.api.request('/admin/stats/payments', { query: { page, limit }, timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }
    const raw = response.data as any;
    const recentPayments: any[] = raw?.recentPayments || [];
    return {
      ok: true,
      data: recentPayments.map(p => ({
        id: p.id ?? '',
        userId: p.userId ?? '',
        amount: p.amount ?? 0,
        method: p.method ?? '',
        reference: p.reference ?? '',
        status: p.status ?? '',
        createdAt: p.date ?? ''
      })),
      total: recentPayments.length
    };
  }

  async getContent(): Promise<{ ok: boolean; data?: AdminContent }> {
    const response = await this.api.request('/admin/stats/content', { timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }
    const raw = response.data as any;
    return {
      ok: true,
      data: {
        totalCases: raw?.cases?.total ?? 0,
        totalLegislations: raw?.legislation?.total ?? 0,
        recentlyAdded: []
      }
    };
  }
}
