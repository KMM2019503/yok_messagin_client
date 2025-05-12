'user client';

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type SocketStore, createSocketStore, initSocketStore } from '@/stores/socket-store'

export type SocketStoreApi = ReturnType<typeof createSocketStore>
export const SocketStoreContext = createContext<SocketStoreApi | undefined>(
    undefined,
)
export interface SocketStoreProviderProps {
    children: ReactNode
}

export const SocketStoreProvider = ({
    children,
}: SocketStoreProviderProps) => {
    const storeRef = useRef<SocketStoreApi | null>(null)

    if (!storeRef.current) {
        storeRef.current = createSocketStore(initSocketStore())
    }

    return (
        <SocketStoreContext.Provider value={storeRef.current}>
            {children}
        </SocketStoreContext.Provider>
    )
}

export const useSocketStore = <T,>(
    selector: (state: SocketStore) => T,
): T => {
    const socketStoreContext = useContext(SocketStoreContext)

    if (!socketStoreContext) {
        throw new Error(`useSocketStore must be used within SocketStoreProvider`)
    }

    return useStore(socketStoreContext, selector)
}