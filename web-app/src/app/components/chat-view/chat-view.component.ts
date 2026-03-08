import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChatMessage, ChatReference } from '../../models/app.models';
import { AskScope } from '../../models/ui.models';
import { formatMarkdown } from '../../utils/format-markdown';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-view.component.html'
})
export class ChatViewComponent {
  constructor(private sanitizer: DomSanitizer) {}

  @Input() isChatEmpty = false;
  @Input() messages: ChatMessage[] = [];
  @Input() awaitingResponse = false;
  @Input() isStreaming = false;
  @Input() chatInput = '';
  @Input() askScope: AskScope = 'all';

  @Output() chatInputChange = new EventEmitter<string>();
  @Output() askScopeChange = new EventEmitter<AskScope>();
  @Output() sendMessage = new EventEmitter<void>();
  @Output() openReference = new EventEmitter<ChatReference>();

  onEnterKey(event: Event): void {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      event.preventDefault();
      this.sendMessage.emit();
    }
  }

  onScopeChange(value: string): void {
    if (value === 'all' || value === 'legislations' || value === 'cases') {
      this.askScopeChange.emit(value);
    }
  }

  formatMessageHtml(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(formatMarkdown(text, 'chat'));
  }

  onBubbleClick(event: MouseEvent, message: ChatMessage): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('ref-chip--chat')) {
      const refIndex = parseInt(target.getAttribute('data-ref') || '', 10);
      if (!isNaN(refIndex) && message.references?.[refIndex - 1]) {
        this.openReference.emit(message.references[refIndex - 1]);
      }
    }
  }

  titleCase(value: unknown): string {
    const str = value == null ? '' : String(value).trim();
    return str
      .toLowerCase()
      .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
  }
}
