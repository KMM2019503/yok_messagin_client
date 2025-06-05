import { UserType } from "./user.type";

export interface LastMessage {
  content: string;
  senderId: string;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  conversationId: string;
  joinedAt: string;
  user: UserType;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  lastMessage?: LastMessage;
  members: Member[];
}

export interface ConversationsResponse {
  conversations: Conversation[];
  nextCursor?: string;
  hasMore: boolean;
}