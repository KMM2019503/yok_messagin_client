// stores/socket-store.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { AuthStore } from './auth-store';
import { toast } from '@/hooks/use-toast';

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  onlineUser: string[];
  connect: (authStore: AuthStore) => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set) => {
  let socket: Socket | null = null;

  return {
    socket: null,
    isConnected: false,
    onlineUser: [],

    connect: (authStore) => {
      if (socket?.connected) return;

      socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
        withCredentials: true,
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        set({ isConnected: true, socket });
        
        socket?.emit('pullUserData');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        set({ isConnected: false });
      });

      socket.on('userData', (userData) => {
        if (userData) {
          authStore.login({
            id: userData.id,
            userName: userData.userName,
            email: userData.email,
            userUniqueID: userData.userUniqueID
          });
        }
      });

      socket.on('pullOnlineUsers', (data) => {
        if(data) {
          set({onlineUser: structuredClone(data)})
        }
      })

      socket.on(
        'newFriendRequest', (data) => {
          if (data) {
            toast({
              title: "New Friend Request!",
              description: `${data.userName} was send friend request`,
            });
          }
        }
      )

      socket.connect();
      set({ socket });
    },

    disconnect: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        set({ socket: null, isConnected: false });
      }
    }
  };
});