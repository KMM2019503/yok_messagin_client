import { create } from "zustand";
import { Conversation, LastMessage } from "@/type/conversation.type";

type ConversationsState = {
  conversations: Conversation[];
  error: string | null;
  nextCursor: string | null | undefined;
  hasMore: boolean;
};

type ConversationsActions = {
  reset: () => void;
  appendConversations: (conversationsData: Conversation[]) => void;
  setError: (error: string | null) => void;
  setNextCursor: (cursor: string | null | undefined) => void;
  setHasMore: (hasMore: boolean) => void;
  updateLastMessage: (conversationId: string, lastMessage: LastMessage) => void;
};

export const useConversationsStore = create<ConversationsState & ConversationsActions>((set) => ({
  conversations: [],
  error: null,
  nextCursor: undefined,
  hasMore: true,

  reset: () => set({
    conversations: [],
    nextCursor: undefined,
    hasMore: true,
    error: null
  }),
  updateLastMessage: (conversationId, lastMessage) => 
    set((state) => {
      // Find the conversation to update
      const conversationToUpdate = state.conversations.find(
        (c) => c.id === conversationId
      );
      
      if (!conversationToUpdate) {
        return state;
      }
      
      const updatedConversation = {
        ...conversationToUpdate,
        lastMessage
      };
      return {
        ...state,
        conversations: [
          updatedConversation,
          ...state.conversations.filter((c) => c.id !== conversationId)
        ]
      };
    }),
  appendConversations: (conversationsData) => set((state) => ({
    conversations: [...state.conversations, ...conversationsData]
  })),
  setError: (error) => set({ error }),
  setNextCursor: (nextCursor) => set({ nextCursor }),
  setHasMore: (hasMore) => set({ hasMore }),
}));