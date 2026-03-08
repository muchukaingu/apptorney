import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  RefDataDivision,
  RefDataItem,
  RefDataListParams,
  RefDataPagedResult
} from '../models/admin-ref-data.models';

@Injectable({ providedIn: 'root' })
export class AdminRefDataService {
  constructor(private readonly api: ApiService) {}

  async list(apiPath: string, params: RefDataListParams): Promise<{ ok: boolean; data?: RefDataPagedResult }> {
    const response = await this.api.request(apiPath, {
      query: {
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        showDeleted: params.showDeleted ? 'true' : undefined
      },
    });

    if (!response.ok) {
      return { ok: false };
    }

    const raw = response.data as any;
    return {
      ok: true,
      data: {
        items: Array.isArray(raw?.items) ? raw.items : [],
        total: raw?.total ?? 0,
        page: raw?.page ?? 1,
        limit: raw?.limit ?? 20,
        pages: raw?.pages ?? 1
      }
    };
  }

  async create(apiPath: string, fieldName: string, value: string): Promise<{ ok: boolean; data?: RefDataItem; message?: string }> {
    const body: Record<string, string> = {};
    body[fieldName] = value;

    const response = await this.api.request(apiPath, {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      const raw = response.data as any;
      return { ok: false, message: raw?.error?.message || 'Could not create record.' };
    }

    const raw = response.data as any;
    return { ok: true, data: raw?.item, message: raw?.message || 'Created.' };
  }

  async update(
    apiPath: string,
    id: string,
    fieldName: string,
    value: string,
    deleted?: boolean
  ): Promise<{ ok: boolean; data?: RefDataItem; message?: string }> {
    const body: Record<string, unknown> = {};
    body[fieldName] = value;
    if (deleted !== undefined) {
      body['deleted'] = deleted;
    }

    const response = await this.api.request(`${apiPath}/${id}`, {
      method: 'PUT',
      body,
    });

    if (!response.ok) {
      const raw = response.data as any;
      return { ok: false, message: raw?.error?.message || 'Could not update record.' };
    }

    const raw = response.data as any;
    return { ok: true, data: raw?.item, message: raw?.message || 'Updated.' };
  }

  async softDelete(apiPath: string, id: string): Promise<{ ok: boolean; message?: string }> {
    const response = await this.api.request(`${apiPath}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const raw = response.data as any;
      return { ok: false, message: raw?.error?.message || 'Could not archive record.' };
    }

    const raw = response.data as any;
    return { ok: true, message: raw?.message || 'Archived.' };
  }

  async restore(apiPath: string, id: string): Promise<{ ok: boolean; data?: RefDataItem; message?: string }> {
    const response = await this.api.request(`${apiPath}/${id}/restore`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const raw = response.data as any;
      return { ok: false, message: raw?.error?.message || 'Could not restore record.' };
    }

    const raw = response.data as any;
    return { ok: true, data: raw?.item, message: raw?.message || 'Restored.' };
  }

  async listDivisions(courtId: string): Promise<{ ok: boolean; data?: RefDataDivision[] }> {
    const response = await this.api.request(`/admin/reference/courts/${courtId}/divisions`);

    if (!response.ok) {
      return { ok: false };
    }

    const raw = response.data as any;
    return { ok: true, data: Array.isArray(raw?.items) ? raw.items : [] };
  }

  async createDivision(courtId: string, name: string): Promise<{ ok: boolean; data?: RefDataDivision; message?: string }> {
    const response = await this.api.request(`/admin/reference/courts/${courtId}/divisions`, {
      method: 'POST',
      body: { name },
    });

    if (!response.ok) {
      const raw = response.data as any;
      return { ok: false, message: raw?.error?.message || 'Could not create division.' };
    }

    const raw = response.data as any;
    return { ok: true, data: raw?.item, message: raw?.message || 'Division created.' };
  }

  async deleteDivision(courtId: string, divisionId: string): Promise<{ ok: boolean; message?: string }> {
    const response = await this.api.request(`/admin/reference/courts/${courtId}/divisions/${divisionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const raw = response.data as any;
      return { ok: false, message: raw?.error?.message || 'Could not remove division.' };
    }

    const raw = response.data as any;
    return { ok: true, message: raw?.message || 'Division removed.' };
  }
}
