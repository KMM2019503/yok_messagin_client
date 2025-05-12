import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
}

export type SocketAction = {
  connect: () => void;
  disconnect: () => void;
}

export type SocketStore = SocketState & SocketAction;

export const initSocketStore = (): SocketState => {
  return {
    socket: null,
    isConnected: false,
  };
};

export const socketDefaultInitState: SocketState = {
  socket: null,
  isConnected: false,
};

export const createSocketStore = (initState: SocketState = socketDefaultInitState) => {
  create<SocketStore>((set) => ({
    socket: null,
    isConnected: false,
  
    connect: () => {
      console.log('Connecting to socket server...');
      const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);
  
      socketInstance.on('connect', () => {
        console.log('Successfully connected to socket server');
        set({ isConnected: true });
      });
  
      socketInstance.on('disconnect', () => {
        set({ isConnected: false });
      });
  
      set({ socket: socketInstance });
    },
  
    disconnect: () => {
      set((state) => {
        state.socket?.disconnect();
        return { socket: null, isConnected: false };
      });
    },
  }));
};