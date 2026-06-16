export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface Message {
  text: string;
  type: MessageType | null;
}