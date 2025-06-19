"use client";

import { useEffect } from "react";
import { useSocketStore } from "@/stores/socket-store";
import { useAuthStore } from "@/providers/auth-store-provider";
import { useMessageStore } from "@/stores/messages";
import { useConversationsStore } from "@/stores/conversations-store";
import { useSelectedConversationStore } from "@/stores/selected-covnersation-store";

const SocketConnection = () => {
  const { connect, disconnect, isConnected, updateLocation } = useSocketStore();
  const authStore = useAuthStore((state) => state);
  const messageStore = useMessageStore();
  const conversationStore = useConversationsStore();
  const selectedConversationStore = useSelectedConversationStore();

  useEffect(() => {
    connect(authStore, messageStore, conversationStore, selectedConversationStore);

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          updateLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation not available or permission denied");
    }
  }, [isConnected]); // Run this only when the socket is connected

  return null;
};

export default SocketConnection;
