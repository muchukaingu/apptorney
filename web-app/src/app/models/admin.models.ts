export interface AdminOverview {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalQueries: number;
  totalCases: number;
  totalLegislations: number;
  totalOrganizations: number;
}

export interface GrowthDataPoint {
  date: string;
  newUsers: number;
  queries: number;
  revenue: number;
  activeSubscriptions: number;
}

export interface AdminSubscriptionBreakdown {
  label: string;
  group: string;
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

export interface AdminTopItem {
  name: string;
  count: number;
}

export interface AdminRecentItem {
  id: string;
  type: string;
  title: string;
  addedAt: string;
}

export interface AdminContent {
  totalCases: number;
  totalLegislations: number;
  recentlyAdded: AdminRecentItem[];
  cases: {
    total: number;
    complete: number;
    incomplete: number;
    verified: number;
    stubs: number;
    byCourt: AdminTopItem[];
    byAreaOfLaw: AdminTopItem[];
  };
  legislation: {
    total: number;
    byType: AdminTopItem[];
  };
}
