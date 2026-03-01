import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  asForm?: boolean;
  skipAuthHeader?: boolean;
  accessToken?: string;
  timeoutMs?: number;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  text: string;
  errorMessage?: string;
  isLikelyCORS?: boolean;
  isLikelyTimeout?: boolean;
}

export const API_BASE = '/api';
const DEFAULT_TIMEOUT_MS = 30000;
const CLIENT_ID = '4449615d-b5b2-4e16-a059-f6bda4486953';
const CLIENT_SECRET = '81ed3948-6ca5-4936-be0b-5db9aec1107b';

const STORAGE_ACCESS_TOKEN = 'apptorney.accessToken';
const STORAGE_REFRESH_TOKEN = 'apptorney.refreshToken';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private refreshPromise: Promise<boolean> | null = null;
  onSessionExpired: (() => void) | null = null;

  constructor(private readonly http: HttpClient) {}

  async request<T = unknown>(path: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const result = await this.executeRequest<T>(path, options);

    if (result.status === 401 && !options.skipAuthHeader) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        return this.executeRequest<T>(path, { ...options, accessToken: undefined });
      }
      this.onSessionExpired?.();
    }

    return result;
  }

  private async executeRequest<T>(path: string, options: ApiRequestOptions): Promise<ApiResponse<T>> {
    const method = options.method ?? 'GET';
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    let params = new HttpParams();
    Object.entries(options.query ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && `${value}`.length > 0) {
        params = params.set(key, String(value));
      }
    });

    let headers = new HttpHeaders({
      Accept: 'application/json',
      'X-IBM-Client-ID': CLIENT_ID,
      'X-IBM-Client-Secret': CLIENT_SECRET
    });

    if (!options.skipAuthHeader) {
      const token = options.accessToken?.trim() || localStorage.getItem(STORAGE_ACCESS_TOKEN)?.trim();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    let body: unknown = options.body;
    if (body !== undefined) {
      if (options.asForm) {
        let form = new HttpParams();
        Object.entries((body as Record<string, unknown>) ?? {}).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            form = form.set(k, String(v));
          }
        });
        body = form.toString();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
      } else {
        headers = headers.set('Content-Type', 'application/json');
      }
    }

    const url = `${API_BASE}${path}`;

    try {
      const response = await firstValueFrom(
        this.http
          .request(method, url, {
            observe: 'response',
            responseType: 'text',
            params,
            headers,
            body
          })
          .pipe(timeout(timeoutMs))
      );

      return this.fromHttpResponse<T>(response);
    } catch (error) {
      return this.fromHttpError<T>(error, timeoutMs);
    }
  }

  private async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefresh();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN)?.trim();
    if (!refreshToken) {
      return false;
    }

    const response = await this.executeRequest<any>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      skipAuthHeader: true
    });

    if (!response.ok || !response.data?.accessToken) {
      localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      return false;
    }

    localStorage.setItem(STORAGE_ACCESS_TOKEN, response.data.accessToken);
    if (response.data.refreshToken) {
      localStorage.setItem(STORAGE_REFRESH_TOKEN, response.data.refreshToken);
    }
    return true;
  }

  private fromHttpResponse<T>(response: HttpResponse<string>): ApiResponse<T> {
    const text = response.body ?? '';
    return {
      ok: response.ok,
      status: response.status,
      data: this.parseMaybeJson(text) as T,
      text
    };
  }

  private fromHttpError<T>(error: unknown, timeoutMs: number): ApiResponse<T> {
    const timeoutError = typeof error === 'object' && error !== null && (error as { name?: string }).name === 'TimeoutError';
    if (timeoutError) {
      return {
        ok: false,
        status: 0,
        data: null,
        text: '',
        errorMessage: `request timed out after ${timeoutMs / 1000}s`,
        isLikelyTimeout: true
      };
    }

    if (error instanceof HttpErrorResponse) {
      const text = typeof error.error === 'string' ? error.error : '';
      return {
        ok: false,
        status: error.status ?? 0,
        data: this.parseMaybeJson(text) as T,
        text,
        errorMessage: error.message || 'request failed',
        isLikelyCORS: error.status === 0
      };
    }

    return {
      ok: false,
      status: 0,
      data: null,
      text: '',
      errorMessage: error instanceof Error ? error.message : 'request failed',
      isLikelyCORS: true
    };
  }

  private parseMaybeJson(text: string): unknown {
    const body = text?.trim() ?? '';
    if (!body) {
      return null;
    }

    if (!(body.startsWith('{') || body.startsWith('['))) {
      return body;
    }

    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
}
