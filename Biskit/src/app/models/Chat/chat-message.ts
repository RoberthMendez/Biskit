export type ChatMessageDirection = 'incoming' | 'outgoing' | 'system';

export interface ChatMessage {
  id: number;
  senderName: string;
  text: string;
  time: string;
  direction: ChatMessageDirection;
  avatarUrl?: string;
}
