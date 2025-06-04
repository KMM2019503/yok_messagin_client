"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import LinkButton from "../ui/link"
import { MdOutlineGroup, MdOutlineGroups } from "react-icons/md"
import { IoChatbubbleOutline } from "react-icons/io5"
import Divider from "../ui/Divider"
import { useAuthStore } from "@/providers/auth-store-provider"
import { Loader2, Plus } from "lucide-react"
import ConversationItem from "./ConversationItem"
import { Conversation, ConversationsResponse, Member } from "@/type/conversation.type"
import { useRouter } from "next/navigation"

const ConversationsBar = () => {
  const { user } = useAuthStore((state) => state)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "direct" | "groups">("all")

  const loadingRef = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const router = useRouter();

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

    // Load more when user scrolls to 80% of the content
    if (scrollPercentage > 0.8) {
      handleLoadMore()
    }
  }, [loading, hasMore])

  // Throttle scroll events for better performance
  const throttledHandleScroll = useCallback(() => {
    let timeoutId: NodeJS.Timeout
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }
  }, [handleScroll])

  const getConversationType = (conversation: Conversation): "direct" | "group" => {
    return conversation.members.length === 2 ? "direct" : "group"
  }

  const getConversationTitle = (conversation: Conversation, currentUserId?: string): string => {
    if (conversation.members.length === 2) {
      // Direct message - show the other user's name
      const otherMember = conversation.members.find((member) => member.userId !== currentUserId)
      return otherMember?.user.userName || "Unknown User"
    } else {
      // Group chat - create a title from member names
      const memberNames = conversation.members
        .slice(0, 3)
        .map((member) => member.user.userName)
        .join(", ")

      if (conversation.members.length > 3) {
        return `${memberNames} and ${conversation.members.length - 3} others`
      }
      return memberNames
    }
  }

  const handleLoadMore = useCallback(() => {
    if (nextCursor && hasMore && !loadingRef.current) {
      handleFetchConversations(nextCursor)
    }
  }, [nextCursor, hasMore])

  const handleFetchConversations = useCallback(
    async (cursorId?: string, reset = false) => {
      if (!user || loadingRef.current) return

      loadingRef.current = true
      setLoading(true)
      setError(null)

      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/conversations/get-conversation`)
        if (cursorId) {
          url.searchParams.append("cursorId", cursorId)
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch conversations: ${response.statusText}`)
        }

        const data: ConversationsResponse = await response.json()

        setConversations((prev) => (reset ? data.conversations : [...prev, ...data.conversations]))
        setNextCursor(data.nextCursor || null)
        setHasMore(data.nextCursor ? true : false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch conversations")
        console.error("Error fetching conversations:", err)
      } finally {
        loadingRef.current = false
        setLoading(false)
      }
    },
    [user],
  )

  const handleRefresh = () => {
    setConversations([])
    setNextCursor(null)
    setHasMore(true)
    handleFetchConversations(undefined, true)
  }

  const handleNewConversation = () => {
    // TODO: Implement new conversation creation
    console.log("Create new conversation")
  }

  useEffect(() => {
    if (conversations.length > 0) {
      router.push(`/content/chats/${conversations[0].id}`)
    }
  }, [conversations])

  useEffect(() => {
    if (user) {
      handleFetchConversations(undefined, true)
    }
  }, [user, handleFetchConversations])

  const filteredConversations = conversations.filter((conversation) => {
    const type = getConversationType(conversation)
    if (activeTab === "direct") return type === "direct"
    if (activeTab === "groups") return type === "group"
    return true // 'all' tab
  })

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "all":
        return <IoChatbubbleOutline className="size-4" />
      case "direct":
        return <MdOutlineGroup className="size-4" />
      case "groups":
        return <MdOutlineGroups className="size-4" />
      default:
        return <IoChatbubbleOutline className="size-4" />
    }
  }

  return (
    <div className="w-[20.5rem] hidden overflow-hidden h-[calc(100vh-16px)] rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700 lg:flex flex-col">
      {/* Header with tabs */}
      <div className="grid grid-cols-3 justify-center items-center py-[0.5rem] px-[0.8rem]">
        <div className="flex items-center justify-center">
          <LinkButton
            icon={getTabIcon("all")}
            type="link"
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "bg-primaryLight-300 dark:bg-purple-400 !text-white dark:!text-primaryLight2-500 !border-white dark:!border-primaryLight2-500" : ""}
          />
        </div>
        <div className="flex items-center justify-center">
          <LinkButton
            icon={getTabIcon("direct")}
            type="link"
            onClick={() => setActiveTab("direct")}
            className={activeTab === "direct" ? "dark:bg-black/40" : ""}
          />
        </div>
        <div className="flex items-center justify-center">
          <LinkButton
            icon={getTabIcon("groups")}
            type="link"
            onClick={() => setActiveTab("groups")}
            className={activeTab === "groups" ? "dark:bg-black/40" : ""}
          />
        </div>
      </div>

      <Divider thickness={2} />

      {/* Header with title and new conversation button */}
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="primary-font-style font-mono text-sm font-medium">
          {activeTab === "all" ? "All Conversations" : activeTab === "direct" ? "Direct Messages" : "Group Chats"}
        </h2>
        <button
          onClick={handleNewConversation}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="New conversation"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 scroll-container-light dark:scroll-container" onScroll={throttledHandleScroll()} ref={scrollContainerRef}>
        {!user ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
            <span className="ml-2 text-sm">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            <button onClick={handleRefresh} className="text-blue-500 text-sm hover:underline">
              Try again
            </button>
          </div>
        ) : filteredConversations.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="text-gray-400 mb-2">{getTabIcon(activeTab)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === "all"
                ? "No conversations yet"
                : activeTab === "direct"
                  ? "No direct messages"
                  : "No group chats"}
            </p>
            <button onClick={handleNewConversation} className="mt-2 text-blue-500 text-sm hover:underline">
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <ConversationItem key={conversation.id} conversation={conversation} currentUserId={user?.id}/>
            ))}

            {/* Loading indicator for infinite scroll */}
            {loading && hasMore && (
              <div className="py-4 flex items-center justify-center">
                <Loader2 className="size-4 animate-spin mr-2" />
                <span className="text-sm text-gray-500">Loading more...</span>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && conversations.length > 0 && (
              <div className="py-4 text-center">
                <span className="text-xs text-gray-400">No more conversations</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationsBar
