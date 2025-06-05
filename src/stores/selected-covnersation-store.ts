import { create } from "zustand";
import { Conversation } from "@/type/conversation.type";

type SelectedConversationType = {
  selectedConversation: Conversation | null;
  changeSelectedConversation: (conversation: Conversation) => void;
  cleanSelectedConversation: () => void;
};

const selectedConversationStore = create<SelectedConversationType>(
  (set, get) => ({
    selectedConversation: null,
    changeSelectedConversation: (conversation: Conversation) => {
      set({ selectedConversation: conversation });
    },
    cleanSelectedConversation: () => {
      set({ selectedConversation: null });
    },
  })
);

// Export the store instance for direct usage in non-component code
export { selectedConversationStore };

// Export the hook for usage in React components
export const useSelectedConversationStore = selectedConversationStore;
