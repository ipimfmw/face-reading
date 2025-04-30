import { create } from 'zustand';
import { ChatMessage, ChatState } from '@/types/chat';

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (message) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...message,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      },
    ],
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
})); 