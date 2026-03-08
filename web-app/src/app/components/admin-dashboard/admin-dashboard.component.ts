import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminContent, AdminOverview, AdminPayment, AdminSubscriptionBreakdown, AdminTopItem, GrowthDataPoint } from '../../models/admin.models';
import { AdminService } from '../../services/admin.service';

type DashboardSeriesKey = 'queries' | 'newUsers' | 'revenue';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private readonly compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
  private readonly wholeNumber = new Intl.NumberFormat('en-US');
  private readonly currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  loading = true;
  error = '';

  overview: AdminOverview | null = null;
  growth: GrowthDataPoint[] = [];
  subscriptions: AdminSubscriptionBreakdown[] = [];
  payments: AdminPayment[] = [];
  paymentsPage = 1;
  paymentPages = 1;
  content: AdminContent | null = null;

  constructor(private readonly adminService: AdminService) {}

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  get heroMetrics(): Array<{ label: string; value: string; note: string }> {
    if (!this.overview) {
      return [];
    }

    return [
      {
        label: 'New users today',
        value: this.formatWhole(this.overview.newUsersToday),
        note: `${this.formatWhole(this.overview.newUsersThisMonth)} this month`
      },
      {
        label: 'Queries today',
        value: this.formatCompact(this.overview.totalQueries),
        note: 'live AI traffic'
      },
      {
        label: 'Active subscriptions',
        value: this.formatWhole(this.overview.activeSubscriptions),
        note: `${this.formatWhole(this.overview.pendingSubscriptions)} pending`
      }
    ];
  }

  get kpiCards(): Array<{ label: string; value: string; note: string; tone: string }> {
    if (!this.overview) {
      return [];
    }

    return [
      {
        label: 'Platform users',
        value: this.formatCompact(this.overview.totalUsers),
        note: `${this.formatWhole(this.overview.activeUsers)} active in the last 30 days`,
        tone: 'sand'
      },
      {
        label: 'Monthly revenue',
        value: this.formatCurrency(this.overview.monthlyRevenue),
        note: `${this.formatCurrency(this.overview.totalRevenue)} lifetime confirmed`,
        tone: 'mint'
      },
      {
        label: 'Cases',
        value: this.formatCompact(this.overview.totalCases),
        note: `${this.formatCompact(this.overview.totalLegislations)} legislations on platform`,
        tone: 'ocean'
      },
      {
        label: 'Organizations',
        value: this.formatWhole(this.overview.totalOrganizations),
        note: `${this.formatWhole(this.overview.activeSubscriptions)} paying subscriptions`,
        tone: 'rose'
      }
    ];
  }

  get latestGrowthPoint(): GrowthDataPoint | null {
    return this.growth.length > 0 ? this.growth[this.growth.length - 1] : null;
  }

  get firstGrowthDate(): string {
    return this.growth.length > 0 ? this.growth[0].date : '';
  }

  get planBreakdown(): AdminSubscriptionBreakdown[] {
    return this.subscriptions.filter((item) => item.group === 'Plans').slice(0, 4);
  }

  get statusBreakdown(): AdminSubscriptionBreakdown[] {
    return this.subscriptions.filter((item) => item.group === 'Statuses').slice(0, 4);
  }

  get billingBreakdown(): AdminSubscriptionBreakdown[] {
    return this.subscriptions.filter((item) => item.group === 'Billing').slice(0, 4);
  }

  get courtBreakdown(): AdminTopItem[] {
    return this.content?.cases.byCourt.slice(0, 5) ?? [];
  }

  get legislationTypeBreakdown(): AdminTopItem[] {
    return this.content?.legislation.byType.slice(0, 5) ?? [];
  }

  async loadDashboard(): Promise<void> {
    this.loading = true;
    this.error = '';

    const [overview, growth, subscriptions, payments, content] = await Promise.all([
      this.adminService.getOverview(),
      this.adminService.getGrowth(),
      this.adminService.getSubscriptions(),
      this.adminService.getPayments(this.paymentsPage),
      this.adminService.getContent()
    ]);

    if (!overview.ok || !growth.ok || !subscriptions.ok || !payments.ok || !content.ok) {
      this.error = 'Dashboard data could not be loaded right now.';
    }

    this.overview = overview.data ?? null;
    this.growth = growth.data ?? [];
    this.subscriptions = subscriptions.data ?? [];
    this.payments = payments.data ?? [];
    this.paymentPages = payments.pages ?? 1;
    this.content = content.data ?? null;
    this.loading = false;
  }

  async loadPayments(page: number): Promise<void> {
    const safePage = Math.max(1, page);
    const result = await this.adminService.getPayments(safePage);
    if (!result.ok) {
      this.error = 'Recent payments could not be refreshed.';
      return;
    }

    this.paymentsPage = safePage;
    this.payments = result.data ?? [];
    this.paymentPages = result.pages ?? 1;
  }

  sparklinePath(series: DashboardSeriesKey, width = 320, height = 180, padding = 18): string {
    const values = this.growth.map((point) => {
      if (series === 'queries') {
        return point.queries;
      }
      if (series === 'revenue') {
        return point.revenue;
      }
      return point.newUsers;
    });

    if (values.length === 0) {
      return '';
    }

    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    const max = Math.max(...values, 1);
    const stepX = values.length > 1 ? usableWidth / (values.length - 1) : usableWidth;

    return values
      .map((value, index) => {
        const x = padding + index * stepX;
        const y = padding + usableHeight - (value / max) * usableHeight;
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
  }

  areaPath(series: DashboardSeriesKey, width = 320, height = 180, padding = 18): string {
    const line = this.sparklinePath(series, width, height, padding);
    if (!line) {
      return '';
    }

    const baseline = height - padding;
    const endX = width - padding;
    const startX = padding;
    return `${line} L ${endX} ${baseline} L ${startX} ${baseline} Z`;
  }

  maxCount(items: Array<{ count: number }>): number {
    return items.length ? Math.max(...items.map((item) => item.count), 1) : 1;
  }

  barWidth(count: number, max: number): string {
    if (!max || count <= 0) {
      return '0%';
    }
    return `${(count / max) * 100}%`;
  }

  formatCompact(value: number): string {
    return this.compactNumber.format(value || 0);
  }

  formatWhole(value: number): string {
    return this.wholeNumber.format(value || 0);
  }

  formatCurrency(value: number): string {
    return this.currency.format(value || 0);
  }
}
