import { create } from "zustand";
import { Conversation, LastMessage } from "@/type/conversation.type";

export type SelectedConversationType = {
  selectedConversation: Conversation | null;
  changeSelectedConversation: (conversation: Conversation) => void;
  cleanSelectedConversation: () => void;
  updateLastMessage: (lastMessage: LastMessage) => void;
  getSelectedConversation: () => String | null;
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
    updateLastMessage: (lastMessage) => {
      console.log("enter", lastMessage);
      set((state) =>
        state.selectedConversation
          ? {
              selectedConversation: {
                ...state.selectedConversation,
                lastMessage,
              },
            }
          : { selectedConversation: null }
      );
    },
    getSelectedConversation: () => get().selectedConversation?.id || null,
  })
);

// Export the store instance for direct usage in non-component code
export { selectedConversationStore };

// Export the hook for usage in React components
export const useSelectedConversationStore = selectedConversationStore;
