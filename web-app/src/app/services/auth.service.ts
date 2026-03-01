import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthTokens, User } from '../models/auth.models';

export interface AuthResult {
  ok: boolean;
  userId?: string;
  message?: string;
}

export interface VerifyOtpResult {
  ok: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
}

export interface RefreshResult {
  ok: boolean;
  accessToken?: string;
  refreshToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly api: ApiService) {}

  async register(fields: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    organization: string;
  }): Promise<AuthResult> {
    const response = await this.api.request('/auth/register', {
      method: 'POST',
      body: {
        email: fields.email,
        firstName: fields.firstName,
        lastName: fields.lastName,
        phone: fields.phone,
        organization: fields.organization
      },
      skipAuthHeader: true
    });

    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.message || response.errorMessage || 'Registration failed.' };
    }

    const data = response.data as any;
    return { ok: true, userId: data?.userId, message: data?.message };
  }

  async login(email: string): Promise<AuthResult> {
    const response = await this.api.request('/auth/login', {
      method: 'POST',
      body: { email },
      skipAuthHeader: true
    });

    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.message || response.errorMessage || 'Login failed.' };
    }

    const data = response.data as any;
    return { ok: true, userId: data?.userId, message: data?.message };
  }

  async verifyOtp(userId: string, otp: string): Promise<VerifyOtpResult> {
    const response = await this.api.request('/auth/verify-otp', {
      method: 'POST',
      body: { userId, otp },
      skipAuthHeader: true
    });

    if (!response.ok) {
      const data = response.data as any;
      return { ok: false, message: data?.message || response.errorMessage || 'OTP verification failed.' };
    }

    const data = response.data as any;
    return {
      ok: true,
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken,
      user: data?.user
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshResult> {
    const response = await this.api.request('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      skipAuthHeader: true
    });

    if (!response.ok) {
      return { ok: false };
    }

    const data = response.data as any;
    return {
      ok: true,
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken
    };
  }
}
