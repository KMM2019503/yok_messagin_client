// components/ConnectionStatus.tsx
'use client'

import { useSocketStore } from '@/stores/socket-store';

export default function ConnectionStatus() {
  const isConnected = useSocketStore((state) => state.isConnected);
  
  return (
    <div className="bg-primaryLight-200 dark:bg-primaryLight2-500 py-1 px-2 rounded-lg absolute bottom-2 right-0">
      Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
    </div>
  );
}