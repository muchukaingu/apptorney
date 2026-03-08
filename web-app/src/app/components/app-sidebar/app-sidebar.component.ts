import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatThreadSummary } from '../../models/app.models';
import { ViewName } from '../../models/ui.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-sidebar.component.html'
})
export class AppSidebarComponent {
  @Input() view: ViewName = 'chat';
  @Input() threads: ChatThreadSummary[] = [];
  @Input() currentThreadId: string | null = null;
  @Input() isAdmin = false;

  @Output() startNewChat = new EventEmitter<void>();
  @Output() setView = new EventEmitter<ViewName>();
  @Output() refreshThreads = new EventEmitter<void>();
  @Output() loadThread = new EventEmitter<string>();
  @Output() toggleSidebar = new EventEmitter<void>();

  normalizeThreadTitle(thread: ChatThreadSummary): string {
    const title = this.toCleanString(thread.title);
    if (title && title.toLowerCase() !== 'new chat') {
      return title;
    }
    return this.toCleanString(thread.lastQuestion) || 'New chat';
  }

  private toCleanString(value: unknown): string {
    return value == null ? '' : String(value).trim();
  }
}
