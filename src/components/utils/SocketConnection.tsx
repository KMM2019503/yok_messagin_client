// components/SocketConnection.tsx
'use client'

import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socket-store';
import { useAuthStore } from '@/providers/auth-store-provider';


const SocketConnection = () => {
  const { connect, disconnect } = useSocketStore();
  const authStore = useAuthStore((state) => state);

  useEffect(() => {
    connect(authStore);

    return () => {
      disconnect();
    };
  }, []);

  return null;
};

export default SocketConnection;