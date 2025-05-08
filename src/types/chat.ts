export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status: "fullfilled" | "pending" | "error";
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  messageIdCounter: number;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  removePendingMessage: () => void;
} 