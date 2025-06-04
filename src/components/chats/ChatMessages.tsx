"use client"

import { useState, useCallback, useRef, useEffect, MutableRefObject } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import MessageItem from "./MessageItem"

type Message = {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  status: {
    status: "SENT" | "DELIVERED" | "READ"
    seenUserIds: string[] | null
  }
  senderId: string
}

type ChatMessagesProps = {
  initialMessages: Message[]
  conversationId: string
  hasMore: boolean
  cookieString: string
  baseUrl: string
}

function useIntersectionObserver({
  target,
  onIntersect,
  enabled = true,
  root = null,
  rootMargin = "100px",
  threshold = 0.1,
}: {
  target: React.RefObject<Element>
  onIntersect: () => void
  enabled: boolean
  root?: Element | null
  rootMargin?: string
  threshold?: number
}) {
  useEffect(() => {
    if (!enabled || !target.current) return

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onIntersect(),
      { root, rootMargin, threshold }
    )

    const el = target.current
    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [enabled, target, onIntersect, root, rootMargin, threshold])
}

export default function ChatMessages({
  initialMessages,
  conversationId,
  hasMore: initialHasMore,
  cookieString,
  baseUrl,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null) as MutableRefObject<HTMLDivElement | null>
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const [initialScroll, setInitialScroll] = useState(true)

  const generateUrl = useCallback(
    (cursorId?: string) => {
      const base = `${baseUrl}/conversations/get-messages/${conversationId}?take=10`
      return cursorId ? `${base}&cursorId=${cursorId}` : base
    },
    [baseUrl, conversationId]
  )

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") as HTMLDivElement
      if (viewport) viewportRef.current = viewport
    }
  }, [])

  useEffect(() => {
    if (initialScroll && viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight
      setInitialScroll(false)
    }
  }, [initialScroll])

  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    setError(null)

    const prevScrollHeight = viewportRef.current?.scrollHeight || 0

    try {
      const oldestMessage = messages[messages.length - 1]
      const cursorId = oldestMessage?.id
      const res = await fetch(generateUrl(cursorId), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieString,
        },
      })

      if (!res.ok) throw new Error("Failed to load more messages")

      const data = await res.json()
      const newMessages: Message[] = data.messages || []

      if (newMessages.length === 0) {
        setHasMore(false)
      } else {
        setMessages((prev) => [...prev, ...newMessages])
        setHasMore(newMessages.length === 10)
      }

      // Maintain scroll position after loading
      setTimeout(() => {
        if (viewportRef.current) {
          const newScrollHeight = viewportRef.current.scrollHeight
          viewportRef.current.scrollTop += newScrollHeight - prevScrollHeight
        }
      }, 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, messages, generateUrl, cookieString])

  useIntersectionObserver({
    target: topSentinelRef,
    onIntersect: loadMoreMessages,
    enabled: hasMore && !loading,
    root: viewportRef.current,
  })

  const displayMessages = [...messages].reverse()

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4">
          <div ref={topSentinelRef} />
          <div className="space-y-4">
            {displayMessages.map((message, index) => (
              <MessageItem key={message.id} message={message} isLast={index === displayMessages.length - 1} />
            ))}
          </div>
          {error && (
            <div className="flex justify-center mt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
                <Button variant="outline" size="sm" onClick={loadMoreMessages} className="mt-2 text-xs">
                  Try again
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
