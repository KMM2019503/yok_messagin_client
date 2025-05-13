// stores/socket-store.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set) => {
  let socket: Socket | null = null;

  return {
    socket: null,
    isConnected: false,

    connect: async () => {
      // Prevent duplicate connections
      if (socket?.connected) return;
      console.log('Connecting to socket server...');

      socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
        withCredentials: true,
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        set({ isConnected: true, socket });
        console.log("🚀 ~ socket.on ~ socket:", socket)
      });

      socket.on('disconnect', () => {
        set({ isConnected: false });
      });

      // Connect manually after setting up listeners
      socket.connect();
      set({ socket });
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