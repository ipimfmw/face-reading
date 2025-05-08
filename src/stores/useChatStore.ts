import { create } from 'zustand';
import { ChatMessage, ChatState } from '@/types/chat';

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  messageIdCounter: 0,
  
  addMessage: (message) => set((state) => {
    const newId = (state.messageIdCounter + 1).toString();
    return {
      messages: [
        ...state.messages,
        {
          ...message,
          id: newId,
          timestamp: Date.now(),
        },
      ],
      messageIdCounter: state.messageIdCounter + 1,
    };
  }),

  removePendingMessage: () => set((state) => {
    return {
      messages: state.messages.filter((message) => message.status !== "pending"),
    };
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
})); 