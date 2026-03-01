import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/app.models';
import { AuthStep } from '../../models/auth.models';
import { AskScope, StatusType } from '../../models/ui.models';
import { formatMarkdown } from '../../utils/format-markdown';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent {
  @Input() loginModalOpen = false;
  @Input() landingPrompt = '';
  @Input() askScope: AskScope = 'all';
  @Input() statusText = '';
  @Input() statusType: StatusType = 'info';
  @Input() publicMessages: ChatMessage[] = [];
  @Input() publicAwaitingResponse = false;
  @Input() publicIsStreaming = false;
  @Input() isLoggedIn = false;
  @Input() userName = '';

  // Auth
  @Input() authStep: AuthStep = 'email';
  @Input() authEmail = '';
  @Input() authFirstName = '';
  @Input() authLastName = '';
  @Input() authPhone = '';
  @Input() authOrganization = '';
  @Input() authOtp = '';
  @Input() authLoading = false;

  @Output() openLoginModal = new EventEmitter<void>();
  @Output() openSignupModal = new EventEmitter<void>();
  @Output() closeLoginModal = new EventEmitter<void>();
  @Output() submitLandingPrompt = new EventEmitter<void>();
  @Output() logoutFromLanding = new EventEmitter<void>();
  @Output() openSubscription = new EventEmitter<void>();

  @Output() landingPromptChange = new EventEmitter<string>();
  @Output() askScopeChange = new EventEmitter<AskScope>();

  // Auth outputs
  @Output() authEmailChange = new EventEmitter<string>();
  @Output() authFirstNameChange = new EventEmitter<string>();
  @Output() authLastNameChange = new EventEmitter<string>();
  @Output() authPhoneChange = new EventEmitter<string>();
  @Output() authOrganizationChange = new EventEmitter<string>();
  @Output() authOtpChange = new EventEmitter<string>();
  @Output() requestOtp = new EventEmitter<void>();
  @Output() submitRegister = new EventEmitter<void>();
  @Output() verifyOtp = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  helpMenuOpen = false;
  showPricing = false;
  showTerms = false;
  showPrivacy = false;
  showUpgradeModal = false;

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.helpMenuOpen) {
      this.helpMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.helpMenuOpen = false;
    this.showUpgradeModal = false;
    if (this.showPricing) {
      this.showPricing = false;
    }
    if (this.showTerms) {
      this.showTerms = false;
    }
    if (this.showPrivacy) {
      this.showPrivacy = false;
    }
  }

  toggleHelpMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.helpMenuOpen = !this.helpMenuOpen;
  }

  openPricing(): void {
    this.showPricing = true;
    this.helpMenuOpen = false;
  }

  closePricing(): void {
    this.showPricing = false;
  }

  openTerms(): void {
    this.showTerms = true;
    this.helpMenuOpen = false;
  }

  closeTerms(): void {
    this.showTerms = false;
  }

  openPrivacy(): void {
    this.showPrivacy = true;
    this.helpMenuOpen = false;
  }

  closePrivacy(): void {
    this.showPrivacy = false;
  }

  get hasPublicChat(): boolean {
    return this.publicMessages.length > 0 || this.publicAwaitingResponse;
  }

  onEnterKey(event: Event): void {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      event.preventDefault();
      this.submitLandingPrompt.emit();
    }
  }

  onScopeChange(value: string): void {
    if (value === 'all' || value === 'legislations' || value === 'cases') {
      this.askScopeChange.emit(value);
    }
  }

  formatMessageHtml(text: string): string {
    return formatMarkdown(text, 'landing');
  }

  onMessageClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('ref-chip--landing')) {
      this.showUpgradeModal = true;
    }
  }
}
