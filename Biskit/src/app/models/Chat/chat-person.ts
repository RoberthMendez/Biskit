import { ChatDetailItem } from './chat-detail-item';

export interface ChatPerson {
  name: string;
  role: string;
  avatarUrl?: string;
  statusLabel?: string;
  statusTone?: 'success' | 'neutral';
  details: ChatDetailItem[];
}