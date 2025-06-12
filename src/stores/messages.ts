// stores/message-store.ts
import { create } from "zustand";
import { MessageType } from "@/type/message.type";

type MessageStoreType = {
  messages: MessageType[];
  setMessages: (newMessages: MessageType[]) => void;
  appendMessages: (moreMessages: MessageType[]) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageStoreType>((set) => ({
  messages: [],
  setMessages: (newMessages) => set({ messages: newMessages }),
  appendMessages: (moreMessages) =>
    set((state) => ({ messages: [...state.messages, ...moreMessages] })),
  clearMessages: () => set({ messages: [] }),
}));
