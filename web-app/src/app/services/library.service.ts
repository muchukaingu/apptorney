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
    const response = await this.api.request('/legislations/viewLegislation', {
      method: 'GET',
      query: { id: legislationId }
    });

    if (!response.ok) {
      return { ok: false, data: null };
    }

    const data = (response.data as any)?.data?.legislation ?? (response.data as any)?.legislation ?? response.data;
    return data && typeof data === 'object' ? { ok: true, data } : { ok: false, data: null };
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
