"use client";

import { useEffect } from "react";
import { useSocketStore } from "@/stores/socket-store";
import { useAuthStore } from "@/providers/auth-store-provider";

const SocketConnection = () => {
  const { connect, disconnect, isConnected, updateLocation } = useSocketStore();
  const authStore = useAuthStore((state) => state);

  useEffect(() => {
    connect(authStore);

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
