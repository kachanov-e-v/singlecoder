export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  mode: 'chat' | 'dev';
}

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
}

export interface AppSettings {
  provider: Provider;
  selectedModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export type AppMode = 'chat' | 'dev';

export interface DevModeFile {
  name: string;
  path: string;
  content: string;
  language: string;
}
