import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AdminContent,
  AdminOverview,
  AdminPayment,
  AdminRecentItem,
  AdminSubscriptionBreakdown,
  AdminTopItem,
  GrowthDataPoint
} from '../models/admin.models';
import {
  AdminCaseFormData,
  AdminCaseListItem,
  AdminCaseListParams,
  AdminLegislationFormData,
  AdminLegislationListItem,
  AdminLegislationListParams,
  AdminMaterialsMeta,
  AdminOption,
  AdminPagedResult
} from '../models/admin-materials.models';

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
        activeUsers: raw?.users?.active ?? 0,
        newUsersToday: raw?.users?.newToday ?? 0,
        newUsersThisMonth: raw?.users?.newThisMonth ?? 0,
        activeSubscriptions: raw?.subscriptions?.active ?? 0,
        pendingSubscriptions: raw?.subscriptions?.pending ?? 0,
        monthlyRevenue: raw?.revenue?.thisMonth ?? 0,
        totalRevenue: raw?.revenue?.total ?? 0,
        totalQueries: raw?.ai?.queriesToday ?? 0,
        totalCases: raw?.content?.totalCases ?? 0,
        totalLegislations: raw?.content?.totalLegislation ?? 0,
        totalOrganizations: raw?.organizations?.total ?? 0
      }
    };
  }

  async getGrowth(period = 30): Promise<{ ok: boolean; data?: GrowthDataPoint[] }> {
    const periodParam = period <= 30 ? '30d' : period <= 90 ? '90d' : period <= 365 ? '1y' : 'all';
    const response = await this.api.request('/admin/stats/growth', {
      query: { period: periodParam },
      timeoutMs: 60000
    });
    if (!response.ok) {
      return { ok: false };
    }

    const raw = response.data as any;
    const dataPoints: any[] = raw?.dataPoints || [];
    return {
      ok: true,
      data: dataPoints.map((item) => ({
        date: item.date ?? '',
        newUsers: item.newUsers ?? 0,
        queries: item.aiQueries ?? 0,
        revenue: item.dailyRevenue ?? 0,
        activeSubscriptions: item.activeSubscriptions ?? 0
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
        breakdowns.push({ label: String(plan), group: 'Plans', count: Number(count) || 0 });
      }
    }

    if (raw?.byStatus) {
      for (const [status, count] of Object.entries(raw.byStatus)) {
        breakdowns.push({ label: String(status), group: 'Statuses', count: Number(count) || 0 });
      }
    }

    if (raw?.byBillingPeriod) {
      for (const [period, count] of Object.entries(raw.byBillingPeriod)) {
        breakdowns.push({ label: String(period), group: 'Billing', count: Number(count) || 0 });
      }
    }

    return { ok: true, data: breakdowns };
  }

  async getPayments(page = 1, limit = 8): Promise<{ ok: boolean; data?: AdminPayment[]; total?: number; pages?: number }> {
    const response = await this.api.request('/admin/stats/payments', {
      query: { page, limit },
      timeoutMs: 60000
    });
    if (!response.ok) {
      return { ok: false };
    }

    const raw = response.data as any;
    const recentPayments: any[] = raw?.recentPayments || [];
    return {
      ok: true,
      data: recentPayments.map((payment) => ({
        id: payment.id ?? '',
        userId: payment.paidById ?? '',
        amount: payment.amount ?? 0,
        method: payment.method ?? '',
        reference: payment.reference ?? '',
        status: payment.status ?? '',
        createdAt: payment.date ?? ''
      })),
      total: raw?.total ?? recentPayments.length,
      pages: raw?.pages ?? 1
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
        recentlyAdded: this.mapRecentItems(raw?.recentlyAdded),
        cases: {
          total: raw?.cases?.total ?? 0,
          complete: raw?.cases?.complete ?? 0,
          incomplete: raw?.cases?.incomplete ?? 0,
          verified: raw?.cases?.verified ?? 0,
          stubs: raw?.cases?.stubs ?? 0,
          byCourt: this.mapTopItems(raw?.cases?.byCourt),
          byAreaOfLaw: this.mapTopItems(raw?.cases?.byAreaOfLaw)
        },
        legislation: {
          total: raw?.legislation?.total ?? 0,
          byType: this.mapTopItems(raw?.legislation?.byType)
        }
      }
    };
  }

  async getMaterialsMeta(): Promise<{ ok: boolean; data?: AdminMaterialsMeta }> {
    const response = await this.api.request('/admin/materials/meta', { timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }

    const raw = response.data as any;
    return {
      ok: true,
      data: {
        cases: {
          courts: this.mapOptions(raw?.cases?.courts),
          areasOfLaw: this.mapOptions(raw?.cases?.areasOfLaw)
        },
        legislations: {
          types: this.mapOptions(raw?.legislations?.types)
        }
      }
    };
  }

  async listCases(params: AdminCaseListParams): Promise<{ ok: boolean; data?: AdminPagedResult<AdminCaseListItem> }> {
    const response = await this.api.request('/admin/materials/cases', {
      query: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        courtId: params.courtId,
        areaOfLawId: params.areaOfLawId,
        year: params.year,
        completionStatus: params.completionStatus,
        primaryReview: params.primaryReview,
        isStub: params.isStub
      },
      timeoutMs: 60000
    });
    if (!response.ok) {
      return { ok: false };
    }

    return {
      ok: true,
      data: this.mapPagedResult<AdminCaseListItem>(response.data as any)
    };
  }

  async getCase(id: string): Promise<{ ok: boolean; data?: AdminCaseFormData }> {
    const response = await this.api.request(`/admin/materials/cases/${id}`, { timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }

    return {
      ok: true,
      data: this.mapCaseFormData((response.data as any)?.item)
    };
  }

  async createCase(payload: AdminCaseFormData): Promise<{ ok: boolean; data?: AdminCaseFormData; message?: string; errors?: string[] }> {
    return this.saveCase('/admin/materials/cases', 'POST', payload);
  }

  async updateCase(id: string, payload: AdminCaseFormData): Promise<{ ok: boolean; data?: AdminCaseFormData; message?: string; errors?: string[] }> {
    return this.saveCase(`/admin/materials/cases/${id}`, 'PUT', payload);
  }

  async listLegislations(params: AdminLegislationListParams): Promise<{ ok: boolean; data?: AdminPagedResult<AdminLegislationListItem> }> {
    const response = await this.api.request('/admin/materials/legislations', {
      query: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        legislationTypeId: params.legislationTypeId,
        assentYear: params.assentYear,
        hasAmendment: params.hasAmendment,
        deletedState: params.deletedState
      },
      timeoutMs: 60000
    });
    if (!response.ok) {
      return { ok: false };
    }

    return {
      ok: true,
      data: this.mapPagedResult<AdminLegislationListItem>(response.data as any)
    };
  }

  async getLegislation(id: string): Promise<{ ok: boolean; data?: AdminLegislationFormData }> {
    const response = await this.api.request(`/admin/materials/legislations/${id}`, { timeoutMs: 60000 });
    if (!response.ok) {
      return { ok: false };
    }

    return {
      ok: true,
      data: this.mapLegislationFormData((response.data as any)?.item)
    };
  }

  async createLegislation(
    payload: AdminLegislationFormData
  ): Promise<{ ok: boolean; data?: AdminLegislationFormData; message?: string; errors?: string[] }> {
    return this.saveLegislation('/admin/materials/legislations', 'POST', payload);
  }

  async updateLegislation(
    id: string,
    payload: AdminLegislationFormData
  ): Promise<{ ok: boolean; data?: AdminLegislationFormData; message?: string; errors?: string[] }> {
    return this.saveLegislation(`/admin/materials/legislations/${id}`, 'PUT', payload);
  }

  private async saveCase(
    path: string,
    method: 'POST' | 'PUT',
    payload: AdminCaseFormData
  ): Promise<{ ok: boolean; data?: AdminCaseFormData; message?: string; errors?: string[] }> {
    const response = await this.api.request(path, {
      method,
      body: {
        name: payload.name,
        caseNumber: payload.caseNumber,
        appealNumber: payload.appealNumber,
        courtId: payload.courtId,
        areaOfLawId: payload.areaOfLawId,
        citation: {
          description: payload.citation.description,
          number: payload.citation.number,
          year: payload.citation.year,
          code: payload.citation.code,
          pageNumber: payload.citation.pageNumber
        },
        plaintiffs: payload.plaintiffs,
        defendants: payload.defendants,
        summaryOfFacts: payload.summaryOfFacts,
        summaryOfRuling: payload.summaryOfRuling,
        judgement: payload.judgement,
        notes: payload.notes,
        completionStatus: payload.completionStatus,
        primaryReview: payload.primaryReview,
        secondayReview: payload.secondayReview,
        isStub: payload.isStub,
        reported: payload.reported
      },
      timeoutMs: 60000
    });

    if (!response.ok) {
      const raw = response.data as any;
      return {
        ok: false,
        message: raw?.error?.message || response.errorMessage || 'Could not save case.',
        errors: raw?.error?.details || []
      };
    }

    const raw = response.data as any;
    const savedId = raw?.item?.id ?? '';
    if (savedId) {
      const detail = await this.getCase(savedId);
      if (detail.ok && detail.data) {
        return {
          ok: true,
          data: detail.data,
          message: raw?.message || 'Case saved.'
        };
      }
    }

    return {
      ok: true,
      data: this.mapCaseFormData(raw?.item),
      message: raw?.message || 'Case saved.'
    };
  }

  private async saveLegislation(
    path: string,
    method: 'POST' | 'PUT',
    payload: AdminLegislationFormData
  ): Promise<{ ok: boolean; data?: AdminLegislationFormData; message?: string; errors?: string[] }> {
    const response = await this.api.request(path, {
      method,
      body: {
        legislationName: payload.legislationName,
        generalTitle: payload.generalTitle,
        chapterNumber: payload.chapterNumber,
        legislationNumber: payload.legislationNumber,
        legislationNumbers: payload.legislationNumbers,
        legislationTypeId: payload.legislationTypeId,
        volumeNumber: payload.volumeNumber,
        dateOfAssent: payload.dateOfAssent,
        yearOfAmendment: payload.yearOfAmendment,
        preamble: payload.preamble,
        enactment: payload.enactment,
        deleted: payload.deleted
      },
      timeoutMs: 60000
    });

    if (!response.ok) {
      const raw = response.data as any;
      return {
        ok: false,
        message: raw?.error?.message || response.errorMessage || 'Could not save legislation.',
        errors: raw?.error?.details || []
      };
    }

    const raw = response.data as any;
    const savedId = raw?.item?.id ?? '';
    if (savedId) {
      const detail = await this.getLegislation(savedId);
      if (detail.ok && detail.data) {
        return {
          ok: true,
          data: detail.data,
          message: raw?.message || 'Legislation saved.'
        };
      }
    }

    return {
      ok: true,
      data: this.mapLegislationFormData(raw?.item),
      message: raw?.message || 'Legislation saved.'
    };
  }

  private mapPagedResult<T>(raw: any): AdminPagedResult<T> {
    return {
      items: Array.isArray(raw?.items) ? (raw.items as T[]) : [],
      total: raw?.total ?? 0,
      page: raw?.page ?? 1,
      limit: raw?.limit ?? 20,
      pages: raw?.pages ?? 1
    };
  }

  private mapOptions(raw: any): AdminOption[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map((item) => ({
      id: item?.id ?? '',
      name: item?.name ?? ''
    }));
  }

  private mapTopItems(raw: any): AdminTopItem[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map((item) => ({
      name: item?.name ?? 'Unknown',
      count: item?.count ?? 0
    }));
  }

  private mapRecentItems(raw: any): AdminRecentItem[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map((item) => ({
      id: item?.id ?? '',
      type: item?.type ?? '',
      title: item?.title ?? '',
      addedAt: item?.addedAt ?? ''
    }));
  }

  private mapCaseFormData(raw: any): AdminCaseFormData {
    return {
      id: raw?.id ?? '',
      name: raw?.name ?? '',
      caseNumber: raw?.caseNumber ?? '',
      appealNumber: raw?.appealNumber ?? '',
      courtId: raw?.courtId ?? '',
      areaOfLawId: raw?.areaOfLawId ?? '',
      courtName: raw?.courtName ?? '',
      areaOfLawName: raw?.areaOfLawName ?? '',
      citation: {
        description: raw?.citation?.description ?? '',
        number: raw?.citation?.number ?? '',
        year: raw?.citation?.year != null ? String(raw.citation.year) : '',
        code: raw?.citation?.code ?? '',
        pageNumber: raw?.citation?.pageNumber != null ? String(raw.citation.pageNumber) : ''
      },
      plaintiffs: this.mapPartyList(raw?.plaintiffs),
      defendants: this.mapPartyList(raw?.defendants),
      summaryOfFacts: raw?.summaryOfFacts ?? '',
      summaryOfRuling: raw?.summaryOfRuling ?? '',
      judgement: raw?.judgement ?? '',
      notes: raw?.notes ?? '',
      completionStatus: raw?.completionStatus === true,
      primaryReview: raw?.primaryReview === true,
      secondayReview: raw?.secondayReview === true,
      isStub: raw?.isStub === true,
      reported: raw?.reported === true
    };
  }

  private mapLegislationFormData(raw: any): AdminLegislationFormData {
    return {
      id: raw?.id ?? '',
      legislationName: raw?.legislationName ?? '',
      generalTitle: raw?.generalTitle ?? '',
      chapterNumber: raw?.chapterNumber ?? '',
      legislationNumber: raw?.legislationNumber ?? '',
      legislationNumbers: raw?.legislationNumbers ?? '',
      legislationTypeId: raw?.legislationTypeId ?? '',
      legislationTypeName: raw?.legislationTypeName ?? '',
      volumeNumber: raw?.volumeNumber ?? '',
      dateOfAssent: this.toDateInputValue(raw?.dateOfAssent),
      yearOfAmendment: raw?.yearOfAmendment != null ? String(raw.yearOfAmendment) : '',
      preamble: raw?.preamble ?? '',
      enactment: raw?.enactment ?? '',
      deleted: raw?.deleted === true
    };
  }

  private mapPartyList(raw: any): Array<{ name: string }> {
    if (!Array.isArray(raw) || raw.length === 0) {
      return [{ name: '' }];
    }

    return raw.map((item) => ({
      name: item?.name ?? ''
    }));
  }

  private toDateInputValue(value: unknown): string {
    const source = value == null ? '' : String(value).trim();
    return source ? source.slice(0, 10) : '';
  }
}
