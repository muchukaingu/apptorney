import { Injectable } from '@angular/core';
import { AskScope } from '../models/ui.models';
import { ChatMessage, ChatReference, ChatThreadSummary } from '../models/app.models';
import { API_BASE, ApiResponse, ApiService } from './api.service';

export interface AskAiResult {
  ok: boolean;
  answer?: string;
  references?: ChatReference[];
  threadId?: string | null;
  message?: string;
  debugMessage?: string;
  userMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private readonly api: ApiService) {}

  async askAI(args: {
    prompt: string;
    scope: AskScope;
    currentThreadId: string | null;
    accessToken: string;
  }): Promise<AskAiResult> {
    const prompt = this.buildScopedPrompt(args.prompt, args.scope);

    const query: Record<string, string> = { question: prompt };
    if (args.currentThreadId) {
      query['threadId'] = args.currentThreadId;
    }
    if (args.accessToken) {
      query['access_token'] = args.accessToken;
    }

    const payload: Record<string, string> = { prompt };
    if (args.currentThreadId) {
      payload['threadId'] = args.currentThreadId;
    }
    if (args.accessToken) {
      payload['access_token'] = args.accessToken;
    }

    const attempts: Array<{ label: string; run: () => Promise<ApiResponse> }> = [
      { label: 'GET question', run: () => this.api.request('/searches/ask-ai', { method: 'GET', query, accessToken: args.accessToken }) },
      { label: 'POST json prompt', run: () => this.api.request('/searches/ask-ai', { method: 'POST', body: payload, accessToken: args.accessToken }) },
      {
        label: 'POST form prompt',
        run: () => this.api.request('/searches/ask-ai', { method: 'POST', body: payload, asForm: true, accessToken: args.accessToken })
      }
    ];

    const failures: string[] = [];

    for (const attempt of attempts) {
      const response = await attempt.run();
      if (!response.ok) {
        failures.push(this.describeFailure(attempt.label, response));
        continue;
      }

      const parsed = this.parseAskAIResponse(response.data, response.text);
      if (!parsed.answer) {
        failures.push(`${attempt.label}: empty answer payload`);
        continue;
      }

      return {
        ok: true,
        answer: parsed.answer,
        references: parsed.references,
        threadId: parsed.threadId
      };
    }

    return this.buildAskAiFailure(failures);
  }

  async fetchChatThreads(accessToken: string): Promise<ChatThreadSummary[]> {
    const query: Record<string, string> = { limit: '30' };
    if (accessToken) {
      query['access_token'] = accessToken;
    }

    const response = await this.api.request('/searches/chat-threads', {
      method: 'GET',
      query,
      accessToken
    });

    if (!response.ok) {
      return [];
    }

    return this.parseThreadSummaries(response.data);
  }

  askAIPublicSSE(args: {
    prompt: string;
    scope: AskScope;
    onToken: (text: string) => void;
    onDone: (answer: string, references: ChatReference[]) => void;
    onError: (message: string) => void;
  }): { abort: () => void } {
    const scopedPrompt = this.buildScopedPrompt(args.prompt, args.scope);
    const params = new URLSearchParams({ question: scopedPrompt, stream: 'true' });
    const url = `${API_BASE}/ask-ai-public?${params.toString()}`;
    const eventSource = new EventSource(url);

    let metadataReferences: ChatReference[] = [];

    eventSource.addEventListener('metadata', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data.sources)) {
          metadataReferences = this.parseSourcesArray(data.sources);
        }
      } catch { /* ignore parse errors */ }
    });

    eventSource.addEventListener('token', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text) {
          args.onToken(data.text);
        }
      } catch { /* ignore parse errors */ }
    });

    eventSource.addEventListener('done', (event: MessageEvent) => {
      eventSource.close();
      try {
        const data = JSON.parse(event.data);
        args.onDone(data.answer || '', metadataReferences);
      } catch {
        args.onDone('', metadataReferences);
      }
    });

    eventSource.addEventListener('error', ((event: MessageEvent) => {
      if (event.data) {
        try {
          const data = JSON.parse(event.data);
          args.onError(data.message || 'An error occurred.');
        } catch { /* ignore */ }
      }
      eventSource.close();
    }) as EventListener);

    eventSource.onerror = () => {
      eventSource.close();
      args.onError('Connection to the server was lost.');
    };

    return { abort: () => eventSource.close() };
  }

  async loadThread(threadId: string, accessToken: string): Promise<{ ok: boolean; history: ChatMessage[] }> {
    const query: Record<string, string> = {};
    if (accessToken) {
      query['access_token'] = accessToken;
    }

    const response = await this.api.request(`/searches/chat-threads/${threadId}`, {
      method: 'GET',
      query,
      accessToken
    });

    if (!response.ok) {
      return { ok: false, history: [] };
    }

    return { ok: true, history: this.parseThreadHistory(response.data) };
  }

  private buildScopedPrompt(prompt: string, scope: AskScope): string {
    const cleanPrompt = this.toCleanString(prompt);
    if (!cleanPrompt || scope === 'all') {
      return cleanPrompt;
    }

    if (scope === 'cases') {
      return `Use Zambian case law sources only when answering.\n\nUser question: ${cleanPrompt}`;
    }

    return `Use Zambian legislation sources only when answering.\n\nUser question: ${cleanPrompt}`;
  }

  private parseAskAIResponse(data: unknown, textFallback: string): { answer: string; references: ChatReference[]; threadId: string | null } {
    if (typeof data === 'string') {
      return { answer: this.toCleanString(data), references: [], threadId: null };
    }

    if (!data || typeof data !== 'object') {
      return { answer: this.toCleanString(textFallback), references: [], threadId: null };
    }

    const root = data as Record<string, any>;
    const nested = root['data'] && typeof root['data'] === 'object' ? (root['data'] as Record<string, any>) : null;

    const keys = ['answer', 'response', 'message', 'text', 'output'];
    let answer = '';

    for (const key of keys) {
      if (typeof root[key] === 'string' && this.toCleanString(root[key])) {
        answer = this.toCleanString(root[key]);
        break;
      }
    }

    if (!answer && nested) {
      for (const key of keys) {
        if (typeof nested[key] === 'string' && this.toCleanString(nested[key])) {
          answer = this.toCleanString(nested[key]);
          break;
        }
      }
    }

    const sourcesRaw = Array.isArray(nested?.['sources'])
      ? nested?.['sources']
      : Array.isArray(root['sources'])
        ? root['sources']
        : [];

    const references = this.parseSourcesArray(sourcesRaw);

    const threadId =
      this.toCleanString(nested?.['thread']?.['id']) || this.toCleanString((root['thread'] as any)?.['id']) || null;

    return {
      answer: answer || this.toCleanString(textFallback),
      references,
      threadId
    };
  }

  private parseThreadSummaries(data: unknown): ChatThreadSummary[] {
    const decode = (item: any): ChatThreadSummary | null => {
      const id = this.toCleanString(item?.id);
      if (!id) {
        return null;
      }
      return {
        id,
        title: this.toCleanString(item?.title) || 'New chat',
        lastQuestion: this.toCleanString(item?.lastQuestion),
        updatedAt: this.toCleanString(item?.updatedAt)
      };
    };

    if (Array.isArray(data)) {
      return data.map(decode).filter((item: ChatThreadSummary | null): item is ChatThreadSummary => item !== null);
    }

    if (data && typeof data === 'object') {
      const root = data as any;
      const base = root?.data && typeof root.data === 'object' ? root.data : root;
      let rows = Array.isArray(base.threads) ? base.threads : [];
      if (!rows.length && base.threads && typeof base.threads === 'object') {
        rows = Array.isArray(base.threads.threads) ? base.threads.threads : [];
      }
      return rows.map(decode).filter((item: ChatThreadSummary | null): item is ChatThreadSummary => item !== null);
    }

    return [];
  }

  private parseThreadHistory(data: unknown): ChatMessage[] {
    if (!data || typeof data !== 'object') {
      return [];
    }

    const root = data as any;
    const base = root?.data && typeof root.data === 'object' ? root.data : root;
    const thread = base?.thread && typeof base.thread === 'object' ? base.thread : base;
    const history = Array.isArray(thread?.history) ? thread.history : [];

    return history
      .map((item: any) => {
        const role = this.toCleanString(item?.role).toLowerCase() === 'user' ? 'user' : 'assistant';
        const text = this.toCleanString(item?.content);
        if (!text) {
          return null;
        }
        return { role, text, references: [] } as ChatMessage;
      })
      .filter((item: ChatMessage | null): item is ChatMessage => item !== null);
  }

  private describeFailure(label: string, response: ApiResponse): string {
    if (response.status === 401) {
      return `${label}: 401 unauthorized`;
    }
    if (response.status === 403) {
      return `${label}: 403 forbidden`;
    }
    if (response.status === 404) {
      return `${label}: 404 not found`;
    }
    if (response.status === 0) {
      return `${label}: network error (${response.errorMessage ?? 'blocked'})`;
    }

    const summary = this.extractErrorSummary(response.data) || this.toCleanString(response.text).slice(0, 140) || 'request failed';
    return `${label}: HTTP ${response.status} (${summary})`;
  }

  private extractErrorSummary(data: unknown): string {
    if (!data) {
      return '';
    }
    if (typeof data === 'string') {
      return this.toCleanString(data);
    }
    if (typeof data === 'object') {
      const d = data as any;
      return this.toCleanString(d?.error?.message || d?.error || d?.message || d?.details || '');
    }
    return '';
  }

  private buildAskAiFailure(failures: string[]): AskAiResult {
    const debugMessage = failures.filter(Boolean).join(' | ') || 'Ask AI failed for unknown reason.';
    const lower = debugMessage.toLowerCase();

    let userMessage = 'Sorry, I could not get a response right now. Please try again.';
    if (lower.includes('401') || lower.includes('403') || lower.includes('token')) {
      userMessage = 'Authentication failed. Open Settings and save a valid access token, then try again.';
    } else if (lower.includes('network') || lower.includes('cors') || lower.includes('timed out')) {
      userMessage = 'Network/CORS blocked the request. Ensure you are running `npm start` with Angular proxy.';
    }

    return {
      ok: false,
      message: 'Ask AI request failed.',
      debugMessage,
      userMessage
    };
  }

  private parseSourcesArray(sourcesRaw: any[]): ChatReference[] {
    return sourcesRaw
      .map((item: any) => {
        const source = this.toCleanString(item?.source).toUpperCase();
        const id = this.toCleanString(item?.id);
        const type = this.toCleanString(item?.type).toLowerCase();
        const title = this.toCleanString(item?.title) || source;
        if (!source || !id || !type) {
          return null;
        }
        return { source, id, type, title };
      })
      .filter((entry: ChatReference | null): entry is ChatReference => entry !== null);
  }

  private toCleanString(value: unknown): string {
    return value == null ? '' : String(value).trim();
  }
}
