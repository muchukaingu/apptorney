export interface ChatReference {
  source: string;
  id: string;
  type: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  references: ChatReference[];
}

export interface ChatThreadSummary {
  id: string;
  title: string;
  lastQuestion: string;
  updatedAt: string;
}

export interface HomeItem {
  title?: string;
  summary?: string;
  type?: string;
  sourceId?: string;
}

export interface DetailSection {
  title: string;
  content: string;
  isHtml?: boolean;
  trustedHtml?: any;
}
