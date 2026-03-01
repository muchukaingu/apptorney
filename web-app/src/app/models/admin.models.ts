export interface AdminOverview {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalQueries: number;
}

export interface GrowthDataPoint {
  date: string;
  newUsers: number;
  queries: number;
  revenue: number;
}

export interface AdminSubscriptionBreakdown {
  plan: string;
  status: string;
  count: number;
}

export interface AdminPayment {
  id: string;
  userId: string;
  userName?: string;
  amount: number;
  method: string;
  reference: string;
  status: string;
  createdAt: string;
}

export interface AdminContent {
  totalCases: number;
  totalLegislations: number;
  recentlyAdded: Array<{ type: string; title: string; addedAt: string }>;
}
