import { Injectable } from '@angular/core';
import { HomeItem } from '../models/app.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  constructor(private readonly api: ApiService) {}

  async searchCases(term: string): Promise<{ ok: boolean; items: any[] }> {
    const response = await this.api.request('/cases/mobilesearch', {
      method: 'GET',
      query: { term }
    });

    if (!response.ok) {
      return { ok: false, items: [] };
    }

    return { ok: true, items: Array.isArray(response.data) ? response.data : [] };
  }

  async searchCasesFiltered(params: {
    term?: string;
    courtId?: string;
    areaOfLawId?: string;
    year?: string;
    page?: number;
    limit?: number;
  }): Promise<{ ok: boolean; items: any[]; total: number; page: number; pages: number }> {
    const query: Record<string, string> = {};
    if (params.term) query['term'] = params.term;
    if (params.courtId) query['courtId'] = params.courtId;
    if (params.areaOfLawId) query['areaOfLawId'] = params.areaOfLawId;
    if (params.year) query['year'] = params.year;
    if (params.page) query['page'] = String(params.page);
    if (params.limit) query['limit'] = String(params.limit);

    const response = await this.api.request('/cases/search', { method: 'GET', query });

    if (!response.ok) {
      return { ok: false, items: [], total: 0, page: 1, pages: 1 };
    }

    const data = response.data as any;
    return {
      ok: true,
      items: Array.isArray(data?.items) ? data.items : [],
      total: data?.total ?? 0,
      page: data?.page ?? 1,
      pages: data?.pages ?? 1
    };
  }

  async getCaseFilters(): Promise<{ courts: { id: string; name: string }[]; areasOfLaw: { id: string; name: string }[]; years: number[] }> {
    const response = await this.api.request('/cases/filters', { method: 'GET' });
    if (!response.ok) {
      return { courts: [], areasOfLaw: [], years: [] };
    }
    const data = response.data as any;
    return {
      courts: Array.isArray(data?.courts) ? data.courts : [],
      areasOfLaw: Array.isArray(data?.areasOfLaw) ? data.areasOfLaw : [],
      years: Array.isArray(data?.years) ? data.years : []
    };
  }

  async searchLegislations(term: string): Promise<{ ok: boolean; items: any[] }> {
    const response = await this.api.request('/legislations/mobilesearch', {
      method: 'GET',
      query: { term }
    });

    if (!response.ok) {
      return { ok: false, items: [] };
    }

    return { ok: true, items: Array.isArray(response.data) ? response.data : [] };
  }

  async searchLegislationsFiltered(params: {
    term?: string;
    legislationTypeId?: string;
    assentYear?: string;
    page?: number;
    limit?: number;
  }): Promise<{ ok: boolean; items: any[]; total: number; page: number; pages: number }> {
    const query: Record<string, string> = {};
    if (params.term) query['term'] = params.term;
    if (params.legislationTypeId) query['legislationTypeId'] = params.legislationTypeId;
    if (params.assentYear) query['assentYear'] = params.assentYear;
    if (params.page) query['page'] = String(params.page);
    if (params.limit) query['limit'] = String(params.limit);

    const response = await this.api.request('/legislations/search', { method: 'GET', query });

    if (!response.ok) {
      return { ok: false, items: [], total: 0, page: 1, pages: 1 };
    }

    const data = response.data as any;
    return {
      ok: true,
      items: Array.isArray(data?.items) ? data.items : [],
      total: data?.total ?? 0,
      page: data?.page ?? 1,
      pages: data?.pages ?? 1
    };
  }

  async getLegislationFilters(): Promise<{ legislationTypes: { id: string; name: string }[]; assentYears: number[] }> {
    const response = await this.api.request('/legislations/filters', { method: 'GET' });
    if (!response.ok) {
      return { legislationTypes: [], assentYears: [] };
    }
    const data = response.data as any;
    return {
      legislationTypes: Array.isArray(data?.legislationTypes) ? data.legislationTypes : [],
      assentYears: Array.isArray(data?.assentYears) ? data.assentYears : []
    };
  }

  async getCaseDetail(caseId: string): Promise<{ ok: boolean; data: any | null }> {
    const response = await this.api.request('/cases/viewCase', {
      method: 'GET',
      query: { id: caseId }
    });

    if (!response.ok) {
      return { ok: false, data: null };
    }

    const data = (response.data as any)?.data?.cases ?? (response.data as any)?.cases ?? response.data;
    return data && typeof data === 'object' ? { ok: true, data } : { ok: false, data: null };
  }

  async getLegislationDetail(legislationId: string): Promise<{ ok: boolean; data: any | null }> {
    const response = await this.api.request('/legislations/view', {
      method: 'GET',
      query: { id: legislationId }
    });

    if (!response.ok) {
      return { ok: false, data: null };
    }

    return response.data && typeof response.data === 'object' ? { ok: true, data: response.data } : { ok: false, data: null };
  }

  async loadBookmarks(username: string, accessToken: string): Promise<HomeItem[]> {
    if (!username) {
      return [];
    }

    const response = await this.api.request<HomeItem[]>('/Customers/bookmarks', {
      method: 'GET',
      query: { username },
      accessToken
    });

    return response.ok && Array.isArray(response.data) ? response.data : [];
  }

  async loadNews(accessToken: string): Promise<HomeItem[]> {
    const response = await this.api.request<HomeItem[]>('/news/viewNews', { method: 'GET', accessToken });
    return response.ok && Array.isArray(response.data) ? response.data : [];
  }

  async loadTrends(accessToken: string): Promise<HomeItem[]> {
    const response = await this.api.request<HomeItem[]>('/trendings/viewTrends', { method: 'GET', accessToken });
    return response.ok && Array.isArray(response.data) ? response.data : [];
  }

  async addBookmark(args: {
    username: string;
    sourceId: string;
    type: 'case' | 'legislation';
    accessToken: string;
  }): Promise<boolean> {
    const payload = {
      username: args.username,
      sourceId: args.sourceId,
      type: args.type
    };

    let response = await this.api.request('/Customers/bookmark', {
      method: 'POST',
      body: payload,
      accessToken: args.accessToken
    });

    if (!response.ok) {
      response = await this.api.request('/Customers/bookmark', {
        method: 'POST',
        body: payload,
        asForm: true,
        accessToken: args.accessToken
      });
    }

    return response.ok;
  }

  async sendFeedback(args: {
    username: string;
    feedback: string;
    scope: string;
    resourceType: 'case' | 'legislation';
    accessToken: string;
  }): Promise<boolean> {
    const payload = {
      appVersion: '1.0.0',
      platform: 'Web',
      username: args.username,
      feedback: args.feedback,
      scope: args.scope,
      resourceType: args.resourceType
    };

    let response = await this.api.request('/feedback', {
      method: 'POST',
      body: payload,
      accessToken: args.accessToken
    });

    if (!response.ok) {
      response = await this.api.request('/feedback', {
        method: 'POST',
        body: payload,
        asForm: true,
        accessToken: args.accessToken
      });
    }

    return response.ok;
  }
}
