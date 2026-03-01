export interface PricingPlan {
  id: string;
  name: string;
  type: 'individual' | 'organization';
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: string;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  organizationName?: string;
  organizationId?: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  subscription: Subscription | null;
  daysRemaining: number;
}

export interface OrgMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface OrgInvitation {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

export type BillingCycle = 'monthly' | 'yearly';
