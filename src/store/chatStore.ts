import { create } from "zustand";

export interface Message {
  id: number;
  sender: string;
  receiver: string;
  text: string;
  read: boolean;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  addMessage: (sender: string, receiver: string, text: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (sender, receiver, text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now(),
          sender,
          receiver,
          text,
          read: false,
          timestamp: new Date().toISOString(),
        },
      ],
    })),
}));
