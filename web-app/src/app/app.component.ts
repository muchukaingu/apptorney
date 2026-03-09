import { CommonModule } from '@angular/common';
import { Component, HostListener, NgZone, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from './components/ui-components.module';
import { ChatMessage, ChatReference, ChatThreadSummary, DetailSection, HomeItem } from './models/app.models';
import { AuthStep, User } from './models/auth.models';
import { BillingCycle, PricingPlan, SubscriptionStatus } from './models/subscription.models';
import { AdminSection, ADMIN_REF_DATA_CONFIGS, RefDataConfig } from './models/admin-ref-data.models';
import { AskScope, StatusType, ViewName } from './models/ui.models';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { LibraryService } from './services/library.service';
import { SubscriptionService } from './services/subscription.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, UiComponentsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly storageKeys = {
    accessToken: 'apptorney.accessToken',
    refreshToken: 'apptorney.refreshToken',
    user: 'apptorney.user'
  } as const;

  private static readonly ADMIN_SECTION_TO_SLUG: Record<AdminSection, string> = {
    dashboard: 'dashboard',
    courts: 'courts',
    jurisdictions: 'jurisdictions',
    locations: 'locations',
    areasOfLaw: 'areas-of-law',
    legislationTypes: 'legislation-types',
    partTypes: 'part-types',
    plaintiffSynonyms: 'plaintiff-synonyms',
    defendantSynonyms: 'defendant-synonyms'
  };

  private static readonly SLUG_TO_ADMIN_SECTION: Record<string, AdminSection> = Object.entries(
    AppComponent.ADMIN_SECTION_TO_SLUG
  ).reduce((acc, [key, value]) => ({ ...acc, [value]: key as AdminSection }), {} as Record<string, AdminSection>);

  private static readonly VALID_VIEWS: readonly ViewName[] = ['chat', 'home', 'cases', 'legislations', 'settings', 'subscription', 'admin'];

  view: ViewName = 'chat';
  adminSection: AdminSection = 'dashboard';
  readonly refDataConfigs = ADMIN_REF_DATA_CONFIGS;
  sidebarOpen = true;
  userMenuOpen = false;
  showLanding = false;
  loginModalOpen = false;

  currentThreadId: string | null = null;
  threads: ChatThreadSummary[] = [];
  messages: ChatMessage[] = [];
  awaitingResponse = false;

  private streamingTimer: ReturnType<typeof setInterval> | null = null;
  private streamingCharacters: string[] = [];
  private streamingCursor = 0;
  private streamingMessageIndex: number | null = null;
  private streamingReferences: ChatReference[] = [];

  caseSearchTerm = '';
  legislationSearchTerm = '';
  private caseDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private legislationDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  caseResults: any[] = [];
  caseFilterCourts: { id: string; name: string }[] = [];
  caseFilterAreas: { id: string; name: string }[] = [];
  caseFilterYears: number[] = [];
  caseFilterCourt = '';
  caseFilterArea = '';
  caseFilterYear = '';
  caseCurrentPage = 1;
  caseTotalPages = 1;
  caseTotalResults = 0;
  caseSearched = false;
  caseLoading = false;
  caseFiltersLoaded = false;
  openFilterDropdown = '';
  filterDropdownSearch = '';
  legislationResults: any[] = [];
  legislationFilterTypes: { id: string; name: string }[] = [];
  legislationFilterYears: number[] = [];
  legislationFilterType = '';
  legislationFilterYear = '';
  legislationCurrentPage = 1;
  legislationTotalPages = 1;
  legislationTotalResults = 0;
  legislationSearched = false;
  legislationLoading = false;
  legislationFiltersLoaded = false;

  bookmarks: HomeItem[] = [];
  news: HomeItem[] = [];
  trends: HomeItem[] = [];

  chatInput = '';
  landingPrompt = '';
  askScope: AskScope = 'all';
  username = '';
  accessToken = '';

  // Auth (OTP flow)
  authStep: AuthStep = 'email';
  authEmail = '';
  authFirstName = '';
  authLastName = '';
  authPhone = '';
  authOrganization = '';
  authOtp = '';
  authLoading = false;
  authUserId = '';
  currentUser: User | null = null;
  refreshToken = '';

  // Subscription
  subscriptionStatus: SubscriptionStatus | null = null;
  pricingPlans: PricingPlan[] = [];
  selectedBillingCycle: BillingCycle = 'monthly';
  subscriptionLoading = false;
  paymentAmount = '';
  paymentMethod = '';
  paymentReference = '';

  statusText = 'Ready.';
  statusType: StatusType = 'info';

  activeDetailType = 'Resource';
  activeDetailTitle = 'Select a resource';
  activeDetailMeta = 'Open a case or legislation from search results or references.';
  activeDetailSections: DetailSection[] = [];
  activeDetail: { type: 'case' | 'legislation'; id: string; data: any } | null = null;
  detailCollapsed = false;
  detailMaximized = false;
  detailOutline: { id: string; label: string; depth: number }[] = [];
  detailInnerSearch = '';
  detailInnerResults: { id: string; label: string }[] = [];
  activeOutlineId = '';
  feedbackInput = '';

  publicMessages: ChatMessage[] = [];
  publicAwaitingResponse = false;
  private publicStreamingText = '';
  private publicStreamAbort: (() => void) | null = null;

  constructor(
    private readonly ngZone: NgZone,
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly libraryService: LibraryService,
    private readonly subscriptionService: SubscriptionService,
    private readonly sanitizer: DomSanitizer
  ) {
    this.apiService.onSessionExpired = () => this.ngZone.run(() => this.logout());
  }

  get isStreaming(): boolean {
    return this.streamingTimer !== null;
  }

  get userInitial(): string {
    const source = this.toCleanString(this.username);
    return source ? source.charAt(0).toUpperCase() : 'U';
  }

  get isChatEmpty(): boolean {
    return this.messages.length === 0 && !this.awaitingResponse && !this.isStreaming;
  }

  get hasActiveSubscription(): boolean {
    return this.subscriptionStatus?.isActive === true;
  }

  async ngOnInit(): Promise<void> {
    await this.hydrateSession();
    window.addEventListener('hashchange', this.onHashChange);
    console.info('Apptorney Angular build 20260215-1', {
      apiBase: '/api',
      proxyTarget: 'http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api'
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('hashchange', this.onHashChange);
    this.stopStreaming();
    this.publicStreamAbort?.();
    if (this.caseDebounceTimer) {
      clearTimeout(this.caseDebounceTimer);
    }
    if (this.legislationDebounceTimer) {
      clearTimeout(this.legislationDebounceTimer);
    }
  }

  private onHashChange = (): void => {
    this.ngZone.run(() => this.restoreStateFromUrl());
  };

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.userMenuOpen) {
      this.userMenuOpen = false;
    }
    if (this.openFilterDropdown) {
      this.openFilterDropdown = '';
      this.filterDropdownSearch = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.userMenuOpen = false;
    this.loginModalOpen = false;
  }

  setView(view: ViewName): void {
    this.view = view;
    this.userMenuOpen = false;
    this.loginModalOpen = false;
    if (this.detailMaximized) {
      this.detailMaximized = false;
    }
    if (view !== 'cases' && view !== 'legislations') {
      this.closeDetail();
    }
    if (view === 'home') {
      this.loadHomeData();
    } else if (view === 'cases') {
      this.loadCaseFilters();
    } else if (view === 'legislations') {
      this.loadLegislationFilters();
    } else if (view === 'subscription') {
      this.loadSubscriptionStatus();
      this.loadPricingPlans();
    } else if (view === 'admin') {
      if (!this.isAdmin) {
        this.view = 'chat';
      } else {
        this.adminSection = 'dashboard';
      }
    }
    this.syncUrlFromState();
  }

  setAdminSection(section: AdminSection): void {
    if (!this.isAdmin) {
      return;
    }
    this.view = 'admin';
    this.adminSection = section;
    this.userMenuOpen = false;
    this.syncUrlFromState();
  }

  get adminSectionLabel(): string {
    if (this.adminSection === 'dashboard') return 'Dashboard';
    const config = this.refDataConfigs[this.adminSection as keyof typeof this.refDataConfigs];
    return config ? config.labelPlural : 'Admin';
  }

  get activeRefDataConfig(): RefDataConfig | null {
    if (this.adminSection === 'dashboard') return null;
    return this.refDataConfigs[this.adminSection as keyof typeof this.refDataConfigs] ?? null;
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  enterApp(view: ViewName = 'chat'): void {
    if (!this.isAdmin && !this.hasActiveSubscription) {
      return;
    }
    this.showLanding = false;
    this.loginModalOpen = false;
    this.view = view;
    this.syncUrlFromState();
  }

  openLoginModal(): void {
    this.authStep = 'email';
    this.authOtp = '';
    this.setStatus('');
    this.loginModalOpen = true;
  }

  openSignupModal(): void {
    this.authStep = 'register';
    this.authOtp = '';
    this.setStatus('');
    this.loginModalOpen = true;
  }

  closeLoginModal(): void {
    this.loginModalOpen = false;
  }

  switchToRegister(): void {
    this.authStep = 'register';
    this.setStatus('');
  }

  switchToLogin(): void {
    this.authStep = 'email';
    this.setStatus('');
  }

  async requestLoginOtp(): Promise<void> {
    const email = this.toCleanString(this.authEmail);
    if (!email) {
      this.setStatus('Please enter your email.', 'error');
      return;
    }

    this.authLoading = true;
    this.setStatus('Sending verification code...');

    const result = await this.authService.login(email);
    this.authLoading = false;

    if (!result.ok) {
      this.setStatus(result.message || 'Could not send verification code.', 'error');
      return;
    }

    this.authUserId = result.userId || '';
    this.authStep = 'otp';
    this.setStatus('Check your email for the verification code.');
  }

  async submitRegister(): Promise<void> {
    const email = this.toCleanString(this.authEmail);
    const firstName = this.toCleanString(this.authFirstName);
    const lastName = this.toCleanString(this.authLastName);
    const phone = this.toCleanString(this.authPhone);
    const organization = this.toCleanString(this.authOrganization);

    if (!email || !firstName || !lastName) {
      this.setStatus('Please enter your email, first name, and last name.', 'error');
      return;
    }

    this.authLoading = true;
    this.setStatus('Creating account...');

    const result = await this.authService.register({ email, firstName, lastName, phone, organization });
    this.authLoading = false;

    if (!result.ok) {
      this.setStatus(result.message || 'Registration failed.', 'error');
      return;
    }

    this.authUserId = result.userId || '';
    this.authStep = 'otp';
    this.setStatus('Check your email for the verification code.');
  }

  async verifyOtp(): Promise<void> {
    const otp = this.toCleanString(this.authOtp);
    if (!otp) {
      this.setStatus('Please enter the verification code.', 'error');
      return;
    }

    this.authLoading = true;
    this.setStatus('Verifying...');

    const result = await this.authService.verifyOtp(this.authEmail, otp);
    this.authLoading = false;

    if (!result.ok) {
      this.setStatus(result.message || 'Verification failed.', 'error');
      return;
    }

    this.accessToken = result.accessToken || '';
    this.refreshToken = result.refreshToken || '';
    this.currentUser = result.user || null;
    this.username = this.currentUser?.firstName ? `${this.currentUser.firstName} ${this.currentUser.lastName || ''}`.trim() : this.currentUser?.email || '';
    this.persistSession();

    this.loginModalOpen = false;
    this.setStatus('Logged in.');

    await this.loadSubscriptionStatus();

    if (this.isAdmin) {
      this.showLanding = false;
      this.view = 'admin';
      this.sidebarOpen = true;
      this.syncUrlFromState();
      this.fetchChatThreads();
    } else if (this.hasActiveSubscription) {
      this.showLanding = false;
      this.syncUrlFromState();
      this.fetchChatThreads();
      this.loadHomeData();
    } else {
      this.showLanding = true;
    }
  }

  async submitLandingPrompt(): Promise<void> {
    const prompt = this.toCleanString(this.landingPrompt);
    if (!prompt) {
      return;
    }

    if (this.accessToken && this.hasActiveSubscription) {
      this.enterApp('chat');
      this.chatInput = prompt;
      this.landingPrompt = '';
      await this.sendMessage();
      return;
    }

    this.landingPrompt = '';
    this.sendPublicMessage(prompt);
  }

  private sendPublicMessage(prompt: string): void {
    if (this.publicAwaitingResponse) {
      return;
    }

    this.publicMessages.push({ role: 'user', text: prompt, references: [] });
    this.publicMessages.push({ role: 'assistant', text: '', references: [] });
    const assistantIndex = this.publicMessages.length - 1;
    this.publicAwaitingResponse = true;
    this.publicStreamingText = '';

    const handle = this.chatService.askAIPublicSSE({
      prompt,
      scope: this.askScope,
      onToken: (text: string) => {
        this.ngZone.run(() => {
          this.publicStreamingText += text;
          this.publicMessages[assistantIndex].text = this.publicStreamingText;
        });
      },
      onDone: (answer: string, references: ChatReference[]) => {
        this.ngZone.run(() => {
          if (answer) {
            this.publicMessages[assistantIndex].text = answer;
          }
          this.publicMessages[assistantIndex].references = references;
          this.publicAwaitingResponse = false;
          this.publicStreamingText = '';
          this.publicStreamAbort = null;
        });
      },
      onError: (message: string) => {
        this.ngZone.run(() => {
          this.publicMessages[assistantIndex].text =
            message || 'Sorry, I could not get a response right now. Please try again.';
          this.publicAwaitingResponse = false;
          this.publicStreamingText = '';
          this.publicStreamAbort = null;
        });
      }
    });

    this.publicStreamAbort = handle.abort;
  }

  openSubscriptionFromLanding(): void {
    this.showLanding = false;
    this.view = 'subscription';
    this.loadSubscriptionStatus();
    this.loadPricingPlans();
  }

  logout(): void {
    this.userMenuOpen = false;
    this.loginModalOpen = false;
    this.stopStreaming();
    this.currentThreadId = null;
    this.awaitingResponse = false;

    this.username = '';
    this.accessToken = '';
    this.refreshToken = '';
    this.currentUser = null;
    this.authEmail = '';
    this.authFirstName = '';
    this.authLastName = '';
    this.authPhone = '';
    this.authOrganization = '';
    this.authOtp = '';
    this.authUserId = '';
    this.authStep = 'email';
    this.chatInput = '';

    this.threads = [];
    this.messages = [];
    this.bookmarks = [];
    this.news = [];
    this.trends = [];
    this.landingPrompt = '';

    this.publicStreamAbort?.();
    this.publicStreamAbort = null;
    this.publicMessages = [];
    this.publicAwaitingResponse = false;
    this.publicStreamingText = '';

    localStorage.removeItem(this.storageKeys.accessToken);
    localStorage.removeItem(this.storageKeys.refreshToken);
    localStorage.removeItem(this.storageKeys.user);

    this.showLanding = true;
    this.view = 'chat';
    history.replaceState(null, '', window.location.pathname);
    this.setStatus('Logged out.');
  }

  async refreshThreads(): Promise<void> {
    await this.fetchChatThreads();
  }

  startNewChat(): void {
    this.stopStreaming();
    this.currentThreadId = null;
    this.awaitingResponse = false;
    this.chatInput = '';
    this.messages = [];
    this.setView('chat');
  }

  usePrompt(prompt: string): void {
    this.chatInput = prompt;
  }

  async sendMessage(): Promise<void> {
    const prompt = this.toCleanString(this.chatInput);
    if (!prompt || this.awaitingResponse || this.isStreaming) {
      return;
    }

    this.messages.push({ role: 'user', text: prompt, references: [] });
    this.chatInput = '';
    this.awaitingResponse = true;

    const result = await this.askAI(prompt);
    this.awaitingResponse = false;

    if (result.ok && result.answer) {
      this.startStreaming(result.answer, result.references ?? []);
      return;
    }

    this.messages.push({
      role: 'assistant',
      text: result.userMessage ?? 'Sorry, I could not get a response right now. Please try again.',
      references: []
    });

    this.setStatus(result.debugMessage ?? result.message ?? 'Ask AI request failed.', 'error');
  }

  private async askAI(
    prompt: string
  ): Promise<{ ok: boolean; answer?: string; references?: ChatReference[]; message?: string; debugMessage?: string; userMessage?: string }> {
    this.syncAccessToken();
    const result = await this.chatService.askAI({
      prompt,
      scope: this.askScope,
      currentThreadId: this.currentThreadId,
      accessToken: this.accessToken
    });

    if (result.ok && result.threadId) {
      this.currentThreadId = result.threadId;
      this.fetchChatThreads();
    }

    return result;
  }

  private startStreaming(text: string, references: ChatReference[]): void {
    this.stopStreaming();

    const answer = this.toCleanString(text);
    if (!answer) {
      return;
    }

    this.messages.push({ role: 'assistant', text: '', references: [] });
    this.streamingMessageIndex = this.messages.length - 1;
    this.streamingCharacters = Array.from(answer);
    this.streamingCursor = 0;
    this.streamingReferences = references;

    this.streamingTimer = setInterval(() => {
      if (this.streamingMessageIndex === null || this.streamingMessageIndex >= this.messages.length) {
        this.stopStreaming();
        return;
      }

      const total = this.streamingCharacters.length;
      if (total === 0) {
        this.stopStreaming();
        return;
      }

      const chunkSize = total > 700 ? 6 : total > 300 ? 4 : 2;
      this.streamingCursor = Math.min(total, this.streamingCursor + chunkSize);

      this.messages[this.streamingMessageIndex].text = this.streamingCharacters.slice(0, this.streamingCursor).join('');

      if (this.streamingCursor >= total) {
        this.messages[this.streamingMessageIndex].references = this.streamingReferences;
        this.stopStreaming();
        this.fetchChatThreads();
      }
    }, 24);
  }

  private stopStreaming(): void {
    if (this.streamingTimer) {
      clearInterval(this.streamingTimer);
      this.streamingTimer = null;
    }
    this.streamingCharacters = [];
    this.streamingCursor = 0;
    this.streamingMessageIndex = null;
    this.streamingReferences = [];
  }

  async fetchChatThreads(): Promise<void> {
    this.syncAccessToken();
    this.threads = await this.chatService.fetchChatThreads(this.accessToken);
  }

  async loadThread(threadId: string): Promise<void> {
    if (!threadId) {
      return;
    }

    this.stopStreaming();
    this.awaitingResponse = false;

    this.syncAccessToken();
    const response = await this.chatService.loadThread(threadId, this.accessToken);
    if (!response.ok) {
      this.setStatus('Failed to load selected thread.', 'error');
      return;
    }

    this.currentThreadId = threadId;
    this.messages = response.history;
  }

  onCaseTermChange(): void {
    if (this.caseDebounceTimer) {
      clearTimeout(this.caseDebounceTimer);
    }

    this.caseDebounceTimer = setTimeout(() => {
      this.caseCurrentPage = 1;
      this.caseResults = [];
      this.caseTotalResults = 0;
      this.caseTotalPages = 1;
      this.runCaseSearch();
    }, 400);
  }

  onCaseFilterChange(): void {
    this.caseCurrentPage = 1;
    this.caseResults = [];
    this.caseTotalResults = 0;
    this.caseTotalPages = 1;
    this.runCaseSearch();
  }

  onCasePageChange(page: number): void {
    if (page < 1 || page > this.caseTotalPages) return;
    this.caseCurrentPage = page;
    this.runCaseSearch();
  }

  clearCaseFilters(): void {
    this.caseSearchTerm = '';
    this.caseFilterCourt = '';
    this.caseFilterArea = '';
    this.caseFilterYear = '';
    this.caseCurrentPage = 1;
    this.caseResults = [];
    this.caseSearched = false;
    this.caseTotalResults = 0;
  }

  get caseFilterAreaLabel(): string {
    if (!this.caseFilterArea) return '';
    const match = this.caseFilterAreas.find(a => a.id === this.caseFilterArea);
    return match?.name || '';
  }

  get caseFilterCourtLabel(): string {
    if (!this.caseFilterCourt) return '';
    const match = this.caseFilterCourts.find(c => c.id === this.caseFilterCourt);
    return match?.name || '';
  }

  get filteredAreas(): { id: string; name: string }[] {
    const term = this.filterDropdownSearch.trim().toLowerCase();
    if (!term) return this.caseFilterAreas;
    return this.caseFilterAreas.filter(a => a.name.toLowerCase().includes(term));
  }

  toggleFilterDropdown(name: string): void {
    if (this.openFilterDropdown === name) {
      this.openFilterDropdown = '';
      this.filterDropdownSearch = '';
    } else {
      this.openFilterDropdown = name;
      this.filterDropdownSearch = '';
    }
  }

  selectCaseFilter(type: string, value: string): void {
    if (type === 'year') this.caseFilterYear = value;
    else if (type === 'area') this.caseFilterArea = value;
    else if (type === 'court') this.caseFilterCourt = value;
    this.openFilterDropdown = '';
    this.filterDropdownSearch = '';
    this.onCaseFilterChange();
  }

  private hasCaseSearchCriteria(): boolean {
    return !!(
      this.toCleanString(this.caseSearchTerm).length >= 2 ||
      this.caseFilterCourt ||
      this.caseFilterArea ||
      this.caseFilterYear
    );
  }

  private async runCaseSearch(): Promise<void> {
    if (!this.hasCaseSearchCriteria()) {
      this.caseResults = [];
      this.caseSearched = false;
      return;
    }

    this.caseLoading = true;
    this.setStatus('Searching cases...');

    const response = await this.libraryService.searchCasesFiltered({
      term: this.toCleanString(this.caseSearchTerm) || undefined,
      courtId: this.caseFilterCourt || undefined,
      areaOfLawId: this.caseFilterArea || undefined,
      year: this.caseFilterYear || undefined,
      page: this.caseCurrentPage,
      limit: 25
    });

    this.ngZone.run(() => {
      this.caseLoading = false;
      this.caseSearched = true;

      if (!response.ok) {
        this.caseResults = [];
        this.setStatus('Case search failed.', 'error');
        return;
      }

      this.caseResults = response.items;
      this.caseTotalPages = response.pages;
      this.caseTotalResults = response.total;
      this.setStatus(`Found ${response.total} case(s).`);
    });
  }

  async loadCaseFilters(): Promise<void> {
    if (this.caseFiltersLoaded) return;
    const filters = await this.libraryService.getCaseFilters();
    this.ngZone.run(() => {
      this.caseFilterCourts = filters.courts;
      this.caseFilterAreas = filters.areasOfLaw;
      this.caseFilterYears = filters.years;
      this.caseFiltersLoaded = true;
    });
  }

  onLegislationTermChange(): void {
    if (this.legislationDebounceTimer) {
      clearTimeout(this.legislationDebounceTimer);
    }

    this.legislationDebounceTimer = setTimeout(() => {
      this.legislationCurrentPage = 1;
      this.legislationResults = [];
      this.legislationTotalResults = 0;
      this.legislationTotalPages = 1;
      this.runLegislationSearch();
    }, 400);
  }

  onLegislationFilterChange(): void {
    this.legislationCurrentPage = 1;
    this.legislationResults = [];
    this.legislationTotalResults = 0;
    this.legislationTotalPages = 1;
    this.runLegislationSearch();
  }

  onLegislationPageChange(page: number): void {
    if (page < 1 || page > this.legislationTotalPages) return;
    this.legislationCurrentPage = page;
    this.runLegislationSearch();
  }

  clearLegislationFilters(): void {
    this.legislationSearchTerm = '';
    this.legislationFilterType = '';
    this.legislationFilterYear = '';
    this.legislationCurrentPage = 1;
    this.legislationResults = [];
    this.legislationSearched = false;
    this.legislationTotalResults = 0;
  }

  get legislationFilterTypeLabel(): string {
    if (!this.legislationFilterType) return '';
    const match = this.legislationFilterTypes.find(t => t.id === this.legislationFilterType);
    return match?.name || '';
  }

  selectLegislationFilter(type: string, value: string): void {
    if (type === 'legType') this.legislationFilterType = value;
    else if (type === 'legYear') this.legislationFilterYear = value;
    this.openFilterDropdown = '';
    this.filterDropdownSearch = '';
    this.onLegislationFilterChange();
  }

  private hasLegislationSearchCriteria(): boolean {
    return !!(
      this.toCleanString(this.legislationSearchTerm).length >= 2 ||
      this.legislationFilterType ||
      this.legislationFilterYear
    );
  }

  private async runLegislationSearch(): Promise<void> {
    if (!this.hasLegislationSearchCriteria()) {
      this.legislationResults = [];
      this.legislationSearched = false;
      return;
    }

    this.legislationLoading = true;
    this.setStatus('Searching legislations...');

    const response = await this.libraryService.searchLegislationsFiltered({
      term: this.toCleanString(this.legislationSearchTerm) || undefined,
      legislationTypeId: this.legislationFilterType || undefined,
      assentYear: this.legislationFilterYear || undefined,
      page: this.legislationCurrentPage,
      limit: 25
    });

    this.ngZone.run(() => {
      this.legislationLoading = false;
      this.legislationSearched = true;

      if (!response.ok) {
        this.legislationResults = [];
        this.setStatus('Legislation search failed.', 'error');
        return;
      }

      this.legislationResults = response.items;
      this.legislationTotalPages = response.pages;
      this.legislationTotalResults = response.total;
      this.setStatus(`Found ${response.total} legislation(s).`);
    });
  }

  async loadLegislationFilters(): Promise<void> {
    if (this.legislationFiltersLoaded) return;
    const filters = await this.libraryService.getLegislationFilters();
    this.ngZone.run(() => {
      this.legislationFilterTypes = filters.legislationTypes;
      this.legislationFilterYears = filters.assentYears;
      this.legislationFiltersLoaded = true;
    });
  }

  async openCaseDetail(caseId: string): Promise<void> {
    if (!caseId) {
      return;
    }

    this.setStatus('Loading case details...');

    const response = await this.libraryService.getCaseDetail(caseId);
    this.ngZone.run(() => {
      if (!response.ok || !response.data) {
        this.setStatus('Could not load case details.', 'error');
        return;
      }

      const data = response.data;

      this.activeDetail = {
        type: 'case',
        id: this.toCleanString((data as any)?.id || (data as any)?._id || caseId),
        data
      };
      this.detailCollapsed = false;

      this.renderCaseDetail(data);
      this.setStatus('Case details loaded.');
    });
  }

  async openLegislationDetail(legislationId: string): Promise<void> {
    if (!legislationId) {
      return;
    }

    this.setStatus('Loading legislation details...');

    const response = await this.libraryService.getLegislationDetail(legislationId);
    this.ngZone.run(() => {
      if (!response.ok || !response.data) {
        this.setStatus('Could not load legislation details.', 'error');
        return;
      }

      const data = response.data;

      this.activeDetail = {
        type: 'legislation',
        id: this.toCleanString((data as any)?.id || (data as any)?._id || legislationId),
        data
      };
      this.detailCollapsed = false;

      this.renderLegislationDetail(data);
      this.setStatus('Legislation details loaded.');
    });
  }

  closeDetail(): void {
    this.activeDetail = null;
    this.detailMaximized = false;
    this.activeDetailType = 'Resource';
    this.activeDetailTitle = 'Select a resource';
    this.activeDetailMeta = 'Open a case or legislation from search results or references.';
    this.activeDetailSections = [];
  }

  private renderCaseDetail(caseData: any): void {
    this.activeDetailType = 'Case';
    this.activeDetailTitle = this.cleanHtmlToText(caseData?.name) || 'Untitled case';

    const metaBits = [
      this.toCleanString(caseData?.areaOfLaw?.name),
      this.buildCaseCitation(caseData),
      this.toCleanString(caseData?.court?.name)
    ].filter(Boolean);

    this.activeDetailMeta = metaBits.join(' | ');

    const sections: DetailSection[] = [];
    const summary = this.cleanHtmlToText(caseData?.summaryOfFacts);
    const holding = this.cleanHtmlToText(caseData?.summaryOfRuling);
    const judgement = this.cleanHtmlToText(caseData?.judgement);

    if (summary) {
      sections.push({ title: 'Summary of Facts', content: summary });
    }
    if (holding) {
      sections.push({ title: 'Holding', content: holding });
    }
    if (judgement) {
      sections.push({ title: 'Judgement', content: judgement });
    }

    const caseRefs = Array.isArray(caseData?.casesReferedTo)
      ? caseData.casesReferedTo
          .map((item: any) => this.cleanHtmlToText(item?.name))
          .filter((value: string) => value)
          .join(', ')
      : '';

    const legislationRefs = Array.isArray(caseData?.legislationsReferedTo)
      ? caseData.legislationsReferedTo
          .map((item: any) => this.cleanHtmlToText(item?.legislationName))
          .filter((value: string) => value)
          .join(', ')
      : '';

    if (caseRefs) {
      sections.push({ title: 'Cases Referenced', content: caseRefs });
    }

    if (legislationRefs) {
      sections.push({ title: 'Legislations Referenced', content: legislationRefs });
    }

    this.activeDetailSections = sections;
    this.buildSectionOutline(sections);
  }

  private buildSectionOutline(sections: DetailSection[]): void {
    this.detailOutline = sections.map((s, i) => ({
      id: `detail-section-${i}`,
      label: s.title,
      depth: 0
    }));
    this.detailInnerSearch = '';
    this.detailInnerResults = [];
    this.activeOutlineId = '';
  }

  private renderLegislationDetail(legislationData: any): void {
    this.activeDetailType = 'Legislation';
    this.activeDetailTitle = this.cleanHtmlToText(legislationData?.legislationName) || 'Untitled legislation';

    const volume = this.toCleanString(legislationData?.volumeNumber);
    const chapter = this.toCleanString(legislationData?.chapterNumber);
    const assent = this.toCleanString(legislationData?.dateOfAssent).slice(0, 4);
    const amended = legislationData?.yearOfAmendment ? `Amended ${legislationData.yearOfAmendment}` : '';

    this.activeDetailMeta = [
      this.toCleanString(legislationData?.legislationType),
      volume && chapter ? `Volume ${volume}, Chapter ${chapter}` : '',
      assent ? `Assent ${assent}` : '',
      amended
    ]
      .filter(Boolean)
      .join(' | ');

    const sections: DetailSection[] = [];
    const preamble = this.cleanHtmlToText(legislationData?.preamble);
    const enactment = this.cleanHtmlToText(legislationData?.enactment);

    if (preamble) {
      sections.push({ title: 'Preamble', content: preamble });
    }

    if (enactment) {
      sections.push({ title: 'Enactment', content: enactment });
    }

    const partsArray = Array.isArray(legislationData?.legislationParts) ? legislationData.legislationParts : [];
    if (partsArray.length) {
      const html = this.renderLegislationParts(partsArray);
      sections.push({
        title: 'Legislation Components',
        content: html,
        isHtml: true,
        trustedHtml: this.sanitizer.bypassSecurityTrustHtml(html)
      });
    }

    this.activeDetailSections = sections;

    // Build outline: section-level entries + legislation parts outline
    const sectionOutline = sections
      .filter(s => !s.isHtml)
      .map((s, i) => ({ id: `detail-section-${i}`, label: s.title, depth: 0 }));
    // legislationPartsOutline was set inside renderLegislationParts
    this.detailOutline = [...sectionOutline, ...this.detailOutline];
    this.detailInnerSearch = '';
    this.detailInnerResults = [];
    this.activeOutlineId = '';
  }

  private renderLegislationParts(parts: any[]): string {
    const outline: { id: string; label: string; depth: number }[] = [];
    let counter = 0;

    const renderNodes = (nodes: any[], depth: number): string => {
      let html = '<ul class="leg-parts">';
      for (const node of nodes) {
        const number = this.toCleanString(node?.number);
        const title = this.cleanHtmlToText(node?.title);
        const content = this.cleanHtmlToText(node?.content);
        const label = [number, title].filter(Boolean).join(' ');
        const id = `leg-part-${counter++}`;

        if (label && depth < 2) {
          outline.push({ id, label, depth });
        }

        html += `<li id="${id}">`;
        if (label) {
          html += `<strong>${this.escapeHtml(label)}</strong>`;
        }
        if (content) {
          html += `<span class="leg-parts__content">${this.escapeHtml(content)}</span>`;
        }
        if (Array.isArray(node?.subParts) && node.subParts.length) {
          html += renderNodes(node.subParts, depth + 1);
        }
        html += '</li>';
      }
      html += '</ul>';
      return html;
    };

    const result = renderNodes(parts, 0);
    this.detailOutline = outline;
    this.detailInnerSearch = '';
    this.detailInnerResults = [];
    this.activeOutlineId = '';
    return result;
  }

  scrollToLegislationPart(id: string): void {
    this.activeOutlineId = id;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('leg-parts--highlight');
      setTimeout(() => el.classList.remove('leg-parts--highlight'), 1500);
    }
  }

  onDetailInnerSearch(): void {
    const term = this.detailInnerSearch.trim().toLowerCase();
    document.querySelectorAll('.leg-parts--search-hit, .detail-section--search-hit').forEach(el =>
      el.classList.remove('leg-parts--search-hit', 'detail-section--search-hit')
    );

    if (!term) {
      this.detailInnerResults = [];
      return;
    }

    const results: { id: string; label: string }[] = [];

    if (this.activeDetailType === 'Legislation') {
      // Search through legislation parts tree
      const allParts = document.querySelectorAll('.leg-parts li[id^="leg-part-"]');
      allParts.forEach(el => {
        const ownText = Array.from(el.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE || (n as Element).tagName !== 'UL')
          .map(n => n.textContent ?? '')
          .join('')
          .toLowerCase();

        if (ownText.includes(term)) {
          el.classList.add('leg-parts--search-hit');
          const strong = el.querySelector(':scope > strong');
          const span = el.querySelector(':scope > .leg-parts__content');
          let label = strong?.textContent?.trim() || '';
          if (!label && span) {
            label = span.textContent?.trim().slice(0, 80) || '';
            if ((span.textContent?.trim().length ?? 0) > 80) label += '...';
          }
          if (!label) {
            const directText = Array.from(el.childNodes)
              .filter(n => n.nodeType === Node.TEXT_NODE)
              .map(n => n.textContent?.trim())
              .filter(Boolean)
              .join(' ')
              .slice(0, 80);
            label = directText || el.id;
          }
          results.push({ id: el.id, label });
        }
      });
    } else {
      // Search through detail sections (cases and other types)
      const allSections = document.querySelectorAll('.detail-section[id^="detail-section-"]');
      allSections.forEach(el => {
        const text = (el as HTMLElement).innerText?.toLowerCase() ?? '';
        if (text.includes(term)) {
          el.classList.add('detail-section--search-hit');
          const h3 = el.querySelector('h3');
          const label = h3?.textContent?.trim() || 'Section';
          results.push({ id: el.id, label });
        }
      });
    }

    this.detailInnerResults = results;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  async addBookmarkFromActiveDetail(): Promise<void> {
    if (!this.activeDetail) {
      return;
    }
    if (!this.username) {
      this.setStatus('Set a username in Settings before bookmarking.', 'error');
      return;
    }

    const ok = await this.libraryService.addBookmark({
      username: this.username,
      sourceId: this.activeDetail.id,
      type: this.activeDetail.type,
      accessToken: this.accessToken
    });

    if (!ok) {
      this.setStatus('Could not add bookmark.', 'error');
      return;
    }

    this.setStatus('Bookmark saved.');
    await this.loadBookmarks();
  }

  async sendFeedbackForActiveDetail(): Promise<void> {
    if (!this.activeDetail) {
      return;
    }

    const feedback = this.toCleanString(this.feedbackInput);
    if (!feedback) {
      this.setStatus('Please enter feedback first.', 'error');
      return;
    }

    if (!this.username) {
      this.setStatus('Set a username in Settings before sending feedback.', 'error');
      return;
    }

    const ok = await this.libraryService.sendFeedback({
      username: this.username,
      feedback,
      scope: this.activeDetail.id,
      resourceType: this.activeDetail.type,
      accessToken: this.accessToken
    });

    if (!ok) {
      this.setStatus('Could not send feedback.', 'error');
      return;
    }

    this.feedbackInput = '';
    this.setStatus('Feedback sent.');
  }

  async loadHomeData(): Promise<void> {
    await Promise.all([this.loadBookmarks(), this.loadNews(), this.loadTrends()]);
  }

  async loadBookmarks(): Promise<void> {
    this.bookmarks = await this.libraryService.loadBookmarks(this.username, this.accessToken);
  }

  async loadNews(): Promise<void> {
    this.news = await this.libraryService.loadNews(this.accessToken);
  }

  async loadTrends(): Promise<void> {
    this.trends = await this.libraryService.loadTrends(this.accessToken);
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Subscription methods

  async loadPricingPlans(): Promise<void> {
    const result = await this.subscriptionService.getPricing();
    this.ngZone.run(() => {
      if (result.ok) {
        this.pricingPlans = result.plans;
      }
    });
  }

  async loadSubscriptionStatus(): Promise<void> {
    const result = await this.subscriptionService.getSubscriptionStatus();
    this.ngZone.run(() => {
      if (result.ok && result.status) {
        this.subscriptionStatus = result.status;
      }
    });
  }

  async subscribeToPlan(planId: string, organizationName?: string): Promise<void> {
    this.subscriptionLoading = true;
    this.setStatus('Subscribing...');

    const result = await this.subscriptionService.subscribe(planId, this.selectedBillingCycle, organizationName);
    this.ngZone.run(() => {
      this.subscriptionLoading = false;

      if (!result.ok) {
        this.setStatus(result.message || 'Subscription failed.', 'error');
        return;
      }

      this.setStatus('Subscribed! Please confirm payment to activate.');
    });
    await this.loadSubscriptionStatus();
  }

  async confirmPayment(): Promise<void> {
    const amount = parseFloat(this.paymentAmount);
    const method = this.toCleanString(this.paymentMethod);
    const reference = this.toCleanString(this.paymentReference);

    if (!amount || !method || !reference || !this.subscriptionStatus?.subscription?.id) {
      this.setStatus('Please fill in all payment fields.', 'error');
      return;
    }

    this.subscriptionLoading = true;
    const result = await this.subscriptionService.confirmPayment(
      this.subscriptionStatus.subscription.id, amount, method, reference
    );
    this.ngZone.run(() => {
      this.subscriptionLoading = false;

      if (!result.ok) {
        this.setStatus(result.message || 'Payment confirmation failed.', 'error');
        return;
      }

      this.paymentAmount = '';
      this.paymentMethod = '';
      this.paymentReference = '';
      this.setStatus(result.message || 'Payment confirmed.');
    });
    await this.loadSubscriptionStatus();
  }

  openReference(reference: ChatReference): void {
    if (reference.type === 'case') {
      this.openCaseDetail(reference.id);
      return;
    }

    if (reference.type === 'legislation') {
      this.openLegislationDetail(reference.id);
      return;
    }

    this.setStatus(`Unknown reference type: ${reference.type}`, 'error');
  }

  buildCaseCitation(item: any): string {
    const caseNumber = this.toCleanString(item?.caseNumber);
    if (caseNumber) {
      return caseNumber;
    }
    const year = item?.citation?.year;
    const code = this.toCleanString(item?.citation?.code);
    const page = item?.citation?.pageNumber;
    return [year, code, page].filter(Boolean).join(' / ');
  }

  caseResultMeta(item: any): string {
    const parts = [this.toCleanString(item?.areaOfLaw?.name), this.buildCaseCitation(item)].filter((part) => !!part);
    return parts.join(' | ');
  }

  legislationResultMeta(item: any): string {
    const amended = item?.yearOfAmendment ? `Amended ${item.yearOfAmendment}` : '';
    const parts = [this.toCleanString(item?.legislationType), amended].filter((part) => !!part);
    return parts.join(' | ');
  }

  cleanHtmlToText(value: unknown): string {
    const source = this.toCleanString(value);
    if (!source) {
      return '';
    }
    const temp = document.createElement('div');
    temp.innerHTML = source;
    return this.toCleanString(temp.textContent ?? temp.innerText ?? '');
  }

  private async hydrateSession(): Promise<void> {
    this.accessToken = this.toCleanString(localStorage.getItem(this.storageKeys.accessToken));
    this.refreshToken = this.toCleanString(localStorage.getItem(this.storageKeys.refreshToken));
    const userJson = localStorage.getItem(this.storageKeys.user);
    if (userJson) {
      try { this.currentUser = JSON.parse(userJson); } catch { this.currentUser = null; }
    }
    this.username = this.currentUser?.firstName ? `${this.currentUser.firstName} ${this.currentUser.lastName || ''}`.trim() : this.currentUser?.email || '';

    if (this.accessToken) {
      // Optimistic UI: set view from cached role before the async subscription check
      // so the user sees the correct view immediately (avoids flash of chat view
      // while the 401 → token-refresh → retry chain completes).
      if (this.isAdmin) {
        this.showLanding = false;
        this.view = 'admin';
        this.adminSection = 'dashboard';
        this.sidebarOpen = true;
        this.restoreStateFromUrl();
        this.syncUrlFromState();
        this.fetchChatThreads();
      } else {
        this.showLanding = false;
      }

      await this.loadSubscriptionStatus();

      if (this.isAdmin) {
        // Admin view already set above; just ensure state is consistent
        this.fetchChatThreads();
      } else if (this.hasActiveSubscription) {
        this.showLanding = false;
        this.restoreStateFromUrl();
        this.syncUrlFromState();
        this.fetchChatThreads();
        if (this.view === 'home') {
          this.loadHomeData();
        }
      } else {
        this.showLanding = true;
      }
    } else {
      this.showLanding = true;
    }
  }

  /** Keep this.accessToken in sync with localStorage (ApiService may have refreshed it) */
  private syncAccessToken(): void {
    this.accessToken = this.toCleanString(localStorage.getItem(this.storageKeys.accessToken));
  }

  private persistSession(): void {
    localStorage.setItem(this.storageKeys.accessToken, this.accessToken);
    localStorage.setItem(this.storageKeys.refreshToken, this.refreshToken);
    if (this.currentUser) {
      localStorage.setItem(this.storageKeys.user, JSON.stringify(this.currentUser));
    }
  }

  private syncUrlFromState(): void {
    if (this.showLanding) {
      return;
    }

    let hash: string;
    if (this.view === 'admin') {
      const slug = AppComponent.ADMIN_SECTION_TO_SLUG[this.adminSection] || 'dashboard';
      hash = slug === 'dashboard' ? '#/admin' : `#/admin/${slug}`;
    } else {
      hash = `#/${this.view}`;
    }

    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }

  private restoreStateFromUrl(): void {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      return;
    }

    const segments = hash.split('/').filter(Boolean);
    const root = segments[0] as string;

    if (root === 'admin' && this.isAdmin) {
      const slug = segments[1] || 'dashboard';
      const section = AppComponent.SLUG_TO_ADMIN_SECTION[slug];
      if (section) {
        this.view = 'admin';
        this.adminSection = section;
      }
      return;
    }

    if ((AppComponent.VALID_VIEWS as readonly string[]).includes(root)) {
      const targetView = root as ViewName;
      if (targetView === 'admin' && !this.isAdmin) {
        return;
      }
      this.view = targetView;
      if (targetView === 'home') {
        this.loadHomeData();
      } else if (targetView === 'cases') {
        this.loadCaseFilters();
      } else if (targetView === 'legislations') {
        this.loadLegislationFilters();
      } else if (targetView === 'subscription') {
        this.loadSubscriptionStatus();
        this.loadPricingPlans();
      }
    }
  }

  private setStatus(text: string, type: StatusType = 'info'): void {
    this.statusText = text;
    this.statusType = type;
  }

  private toCleanString(value: unknown): string {
    return value == null ? '' : String(value).trim();
  }
}
