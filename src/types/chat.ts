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
  context: string;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  removePendingMessage: () => void;
  setContext: (context: string) => void;
} 