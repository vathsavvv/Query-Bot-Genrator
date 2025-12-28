
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
  uploadedAt: string;
  status: 'SCANNING' | 'ACTIVE' | 'ERROR';
}

export interface BotConfig {
  name: string;
  companyName: string;
  industry: string;
  customInstructions: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
  BOT_SETUP = 'BOT_SETUP',
  CHAT = 'CHAT'
}
