import { CommonModule } from '@angular/common';
import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiComponentsModule } from './components/ui-components.module';
import { ChatMessage, ChatReference, ChatThreadSummary, DetailSection, HomeItem } from './models/app.models';
import { AuthStep, User } from './models/auth.models';
import { AdminContent, AdminOverview, AdminPayment, AdminSubscriptionBreakdown, GrowthDataPoint } from './models/admin.models';
import { BillingCycle, PricingPlan, SubscriptionStatus } from './models/subscription.models';
import { AskScope, StatusType, ViewName } from './models/ui.models';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { AdminService } from './services/admin.service';
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

  view: ViewName = 'chat';
  sidebarOpen = false;
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
  legislationResults: any[] = [];

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

  // Admin
  adminOverview: AdminOverview | null = null;
  adminGrowth: GrowthDataPoint[] = [];
  adminSubscriptions: AdminSubscriptionBreakdown[] = [];
  adminPayments: AdminPayment[] = [];
  adminPaymentsPage = 1;
  adminPaymentsTotal = 0;
  adminContent: AdminContent | null = null;
  adminLoading = false;

  statusText = 'Ready.';
  statusType: StatusType = 'info';

  activeDetailType = 'Resource';
  activeDetailTitle = 'Select a resource';
  activeDetailMeta = 'Open a case or legislation from search results or references.';
  activeDetailSections: DetailSection[] = [];
  activeDetail: { type: 'case' | 'legislation'; id: string; data: any } | null = null;
  feedbackInput = '';

  publicMessages: ChatMessage[] = [];
  publicAwaitingResponse = false;
  private publicStreamingText = '';
  private publicStreamAbort: (() => void) | null = null;

  constructor(
    private readonly ngZone: NgZone,
    private readonly apiService: ApiService,
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly libraryService: LibraryService,
    private readonly subscriptionService: SubscriptionService
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
    console.info('Apptorney Angular build 20260215-1', {
      apiBase: '/api',
      proxyTarget: 'http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api'
    });
  }

  ngOnDestroy(): void {
    this.stopStreaming();
    this.publicStreamAbort?.();
    if (this.caseDebounceTimer) {
      clearTimeout(this.caseDebounceTimer);
    }
    if (this.legislationDebounceTimer) {
      clearTimeout(this.legislationDebounceTimer);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.userMenuOpen) {
      this.userMenuOpen = false;
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
    if (view === 'home') {
      this.loadHomeData();
    } else if (view === 'subscription') {
      this.loadSubscriptionStatus();
      this.loadPricingPlans();
    } else if (view === 'admin') {
      if (!this.isAdmin) {
        this.view = 'chat';
        return;
      }
      this.loadAdminDashboard();
    }
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  enterApp(view: ViewName = 'chat'): void {
    if (!this.hasActiveSubscription) {
      return;
    }
    this.showLanding = false;
    this.loginModalOpen = false;
    this.view = view;
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

    if (this.hasActiveSubscription) {
      this.showLanding = false;
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
    this.threads = await this.chatService.fetchChatThreads(this.accessToken);
  }

  async loadThread(threadId: string): Promise<void> {
    if (!threadId) {
      return;
    }

    this.stopStreaming();
    this.awaitingResponse = false;

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

    if (this.toCleanString(this.caseSearchTerm).length < 2) {
      this.caseResults = [];
      return;
    }

    this.caseDebounceTimer = setTimeout(() => {
      this.searchCases(this.caseSearchTerm);
    }, 350);
  }

  private async searchCases(term: string): Promise<void> {
    this.setStatus('Searching cases...');

    const response = await this.libraryService.searchCases(term);
    if (!response.ok) {
      this.caseResults = [];
      this.setStatus('Case search failed.', 'error');
      return;
    }

    this.caseResults = response.items;
    this.setStatus(`Found ${this.caseResults.length} case result(s).`);
  }

  onLegislationTermChange(): void {
    if (this.legislationDebounceTimer) {
      clearTimeout(this.legislationDebounceTimer);
    }

    if (this.toCleanString(this.legislationSearchTerm).length < 2) {
      this.legislationResults = [];
      return;
    }

    this.legislationDebounceTimer = setTimeout(() => {
      this.searchLegislations(this.legislationSearchTerm);
    }, 350);
  }

  private async searchLegislations(term: string): Promise<void> {
    this.setStatus('Searching legislations...');

    const response = await this.libraryService.searchLegislations(term);
    if (!response.ok) {
      this.legislationResults = [];
      this.setStatus('Legislation search failed.', 'error');
      return;
    }

    this.legislationResults = response.items;
    this.setStatus(`Found ${this.legislationResults.length} legislation result(s).`);
  }

  async openCaseDetail(caseId: string): Promise<void> {
    if (!caseId) {
      return;
    }

    this.setStatus('Loading case details...');

    const response = await this.libraryService.getCaseDetail(caseId);
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

    this.renderCaseDetail(data);
    this.setStatus('Case details loaded.');
  }

  async openLegislationDetail(legislationId: string): Promise<void> {
    if (!legislationId) {
      return;
    }

    this.setStatus('Loading legislation details...');

    const response = await this.libraryService.getLegislationDetail(legislationId);
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

    this.renderLegislationDetail(data);
    this.setStatus('Legislation details loaded.');
  }

  closeDetail(): void {
    this.activeDetail = null;
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

    const parts = this.flattenLegislationTitles(Array.isArray(legislationData?.legislationParts) ? legislationData.legislationParts : []);
    if (parts.length) {
      sections.push({ title: 'Parts', content: parts.join(' | ') });
    }

    this.activeDetailSections = sections;
  }

  private flattenLegislationTitles(parts: any[]): string[] {
    const output: string[] = [];

    const walk = (nodes: any[]): void => {
      nodes.forEach((node) => {
        const label = [this.toCleanString(node?.number), this.cleanHtmlToText(node?.title)].filter(Boolean).join(' ');
        if (label) {
          output.push(label);
        }
        if (Array.isArray(node?.subParts) && node.subParts.length) {
          walk(node.subParts);
        }
      });
    };

    walk(parts);
    return output;
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
    if (result.ok) {
      this.pricingPlans = result.plans;
    }
  }

  async loadSubscriptionStatus(): Promise<void> {
    const result = await this.subscriptionService.getSubscriptionStatus();
    if (result.ok && result.status) {
      this.subscriptionStatus = result.status;
    }
  }

  async subscribeToPlan(planId: string, organizationName?: string): Promise<void> {
    this.subscriptionLoading = true;
    this.setStatus('Subscribing...');

    const result = await this.subscriptionService.subscribe(planId, this.selectedBillingCycle, organizationName);
    this.subscriptionLoading = false;

    if (!result.ok) {
      this.setStatus(result.message || 'Subscription failed.', 'error');
      return;
    }

    this.setStatus('Subscribed successfully.');
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
    this.subscriptionLoading = false;

    if (!result.ok) {
      this.setStatus(result.message || 'Payment confirmation failed.', 'error');
      return;
    }

    this.paymentAmount = '';
    this.paymentMethod = '';
    this.paymentReference = '';
    this.setStatus(result.message || 'Payment confirmed.');
    await this.loadSubscriptionStatus();
  }

  // Admin methods

  async loadAdminDashboard(): Promise<void> {
    this.adminLoading = true;
    await Promise.all([
      this.loadAdminOverview(),
      this.loadAdminGrowth(),
      this.loadAdminSubscriptions(),
      this.loadAdminPayments(),
      this.loadAdminContent()
    ]);
    this.adminLoading = false;
  }

  async loadAdminOverview(): Promise<void> {
    const result = await this.adminService.getOverview();
    if (result.ok && result.data) {
      this.adminOverview = result.data;
    }
  }

  async loadAdminGrowth(period?: number): Promise<void> {
    const result = await this.adminService.getGrowth(period);
    if (result.ok && result.data) {
      this.adminGrowth = result.data;
    }
  }

  async loadAdminSubscriptions(): Promise<void> {
    const result = await this.adminService.getSubscriptions();
    if (result.ok && result.data) {
      this.adminSubscriptions = result.data;
    }
  }

  async loadAdminPayments(page?: number): Promise<void> {
    if (page !== undefined) {
      this.adminPaymentsPage = page;
    }
    const result = await this.adminService.getPayments(this.adminPaymentsPage);
    if (result.ok) {
      this.adminPayments = result.data || [];
      this.adminPaymentsTotal = result.total || 0;
    }
  }

  async loadAdminContent(): Promise<void> {
    const result = await this.adminService.getContent();
    if (result.ok && result.data) {
      this.adminContent = result.data;
    }
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
      await this.loadSubscriptionStatus();
      this.showLanding = !this.hasActiveSubscription;
      if (!this.showLanding) {
        this.fetchChatThreads();
        this.loadHomeData();
      }
    } else {
      this.showLanding = true;
    }
  }

  private persistSession(): void {
    localStorage.setItem(this.storageKeys.accessToken, this.accessToken);
    localStorage.setItem(this.storageKeys.refreshToken, this.refreshToken);
    if (this.currentUser) {
      localStorage.setItem(this.storageKeys.user, JSON.stringify(this.currentUser));
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
