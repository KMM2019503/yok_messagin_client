// stores/socket-store.ts
import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { AuthStore } from "./auth-store";
import { toast } from "@/hooks/use-toast";
import { friendStore } from "./friends";
import { MessageStore } from "./messages";
import { ConversationsStore } from "./conversations-store";
import { SelectedConversationType } from "./selected-covnersation-store";

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  onlineUser: string[];
  connect: (
    authStore: AuthStore,
    messageStore: MessageStore,
    conversationStore: ConversationsStore,
    selectedConversationStore: SelectedConversationType
  ) => void;
  disconnect: () => void;
  updateLocation: (location: { latitude: number; longitude: number }) => void;
  checkUserOnlineStatus: (userId: string) => boolean;
};

export const useSocketStore = create<SocketState>((set) => {
  let socket: Socket | null = null;

  return {
    socket: null,
    isConnected: false,
    onlineUser: [],

    connect: (
      authStore,
      messageStore,
      conversationStore,
      selectedConversationStore
    ) => {
      if (socket?.connected) return;

      socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
        withCredentials: true,
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        set({ isConnected: true, socket });

        socket?.emit("pullUserData");
      });

      socket.on("userData", (userData) => {
        if (userData) {
          authStore.login({
            id: userData.id,
            userName: userData.userName,
            email: userData.email,
            userUniqueID: userData.userUniqueID,
            profilePictureUrl: userData.profilePictureUrl || null,
            lastActiveAt: userData.lastActiveAt,
          });
        }
      });

      socket.on("pullOnlineUsers", (data) => {
        if (data) {
          set({ onlineUser: structuredClone(data) });
        }
      });

      socket.on("newFriendRequest", (data) => {
        if (data) {
          toast({
            title: "New Friend Request!",
            description: `${data.userName} was send friend request`,
          });
          friendStore.getState().addRequest(data.request);
        }
      });

      socket.on("friendRequestResponse", (data) => {
        if (data) {
          if (data.status === "accepted") {
            friendStore.getState().addFriend(data.friendRequest.receiver);
            friendStore
              .getState()
              .removeListItem(data.friendRequest.id, "outgoing");
          } else if (data.status === "rejected") {
            friendStore.getState().updateOutGoingRequests(data.friendRequest);
          } else if (data.status === "cancelled") {
            friendStore
              .getState()
              .removeListItem(data.friendRequest.id, "request");
          }
          toast({
            title: "Friend Request Response",
            description: data.message,
          });
        }
      });

      socket.on("incomingNewMessage", (data) => {
        const newMessageAudio = new Audio("/sounds/mixkit-long-pop-2358.wav");
        if (data) {
          conversationStore.updateLastMessage(data.updatedConversation.id, {
            content: data.message.content,
            createdAt: data.message.createdAt,
          });
          if (
            selectedConversationStore.getSelectedConversation() ===
            data.message.conversationId
          ) {
            messageStore.addMessages({
              ...data.message,
              senderId: data.message.sender.id,
            });
          } else {
            newMessageAudio.play().catch((err) => {
              console.log("Audio play prevented:", err);
            });
            toast({
              title: `New Message Form ${data.message.sender.userName}`,
              description: data.message.content,
            });
          }
        }
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        set({ isConnected: false });
      });

      socket.connect();
      set({ socket });
    },

    updateLocation: (location: { latitude: number; longitude: number }) => {
      const currentSocket = useSocketStore.getState().socket;
      if (currentSocket?.connected) {
        currentSocket.emit("updateUserLocation", location);
      }
    },
    checkUserOnlineStatus: (userId: string): boolean => {
      const { onlineUser } = useSocketStore.getState();
      return onlineUser.includes(userId);
    },

    disconnect: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        set({ socket: null, isConnected: false });
      }
    },
  };
});
