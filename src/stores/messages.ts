// stores/message-store.ts
import { create } from "zustand";
import { MessageType } from "@/type/message.type";

export type MessageStore = {
  messages: MessageType[];
  setMessages: (newMessages: MessageType[]) => void;
  appendMessages: (moreMessages: MessageType[]) => void;
  addMessages: (message: MessageType) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessages: (message) =>
    set((state) => ({ messages: [...[message], ...state.messages] })),
  setMessages: (newMessages) => set({ messages: newMessages }),
  appendMessages: (moreMessages) =>
    set((state) => ({ messages: [...state.messages, ...moreMessages] })),
  clearMessages: () => {
    set({ messages: [] });
  },
}));
