import { useAuthStore } from '@/providers/auth-store-provider';
import { useSocketStore } from '@/stores/socket-store';
import React, { useEffect } from 'react'

const SocketConnection = () => {
    const { connect, disconnect, isConnected } = useSocketStore();
    const { user } = useAuthStore((state) => state);

    useEffect(() => {
      if (!user) return;
      connect();
  
      return () => {
        disconnect();
      };
    }, [user]);

    return null;
}

export default SocketConnection