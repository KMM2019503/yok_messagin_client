"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { IoChatbubbleOutline } from "react-icons/io5";
import { Plus } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthStore } from "@/providers/auth-store-provider";
import { useSelectedConversationStore } from "@/stores/selected-covnersation-store";
import { useConversationsStore } from "@/stores/conversations-store";
import { cn } from "@/lib/utils";
import Divider from "../ui/Divider";
import ConversationItem from "./ConversationItem";
import { ConversationsResponse } from "@/type/conversation.type";

const ConversationsBar = () => {
  const router = useRouter();
  const { user } = useAuthStore((state) => state);
  const [loading, setLoading] = useState<boolean>(false);

  // Store hooks
  const {
    conversations,
    reset,
    appendConversations,
    error,
    hasMore,
    nextCursor,
    setError,
    setHasMore,
    setNextCursor,
  } = useConversationsStore();

  const { selectedConversation, changeSelectedConversation } =
    useSelectedConversationStore();

  const handleFetchConversations = useCallback(
    async (cursorId?: string, shouldReset = false) => {
      // Only fetch if we have a user and not already loading
      if (!user || loading) return;

      setLoading(true);
      setError(null);

      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/get-conversation`
        );

        if (cursorId) {
          url.searchParams.append("cursorId", cursorId);
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch conversations: ${response.statusText}`
          );
        }

        const data: ConversationsResponse = await response.json();

        if (shouldReset) {
          reset();
        }

        appendConversations(data.conversations);
        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch conversations"
        );
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    },
    [
      user,
      loading,
      reset,
      appendConversations,
      setNextCursor,
      setHasMore,
      setError,
    ]
  );

  const handleRefresh = useCallback(() => {
    handleFetchConversations(undefined, true);
  }, [handleFetchConversations]);

  const handleNewConversation = useCallback(() => {
    console.log("Add new conversation");
  }, []);

  const loadMore = useCallback(() => {
    if (nextCursor) {
      handleFetchConversations(nextCursor);
    }
  }, [nextCursor, handleFetchConversations]);

  // Effects
  useEffect(() => {
    const isMobile = window.innerWidth <= 576;
    if (!isMobile && conversations.length > 0 && !selectedConversation) {
      changeSelectedConversation(conversations[0]);
      router.push(`/content/chats/${conversations[0].id}`);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    if (user && conversations.length === 0 && !loading) {
      handleFetchConversations();
    }
  }, [user, loading]);

  return (
    <div
      className={cn(
        "w-full lg:w-[20.5rem] overflow-hidden h-screen lg:h-[calc(100vh-16px)] rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700 lg:flex flex-col",
        selectedConversation ? "hidden lg:block" : "justify-start"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <IoChatbubbleOutline className="size-4" />
        <h2 className="primary-font-style font-mono text-xs font-medium">
          You Have 3 New messages
        </h2>
        <button
          onClick={handleNewConversation}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="New conversation"
          aria-label="New conversation"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Divider />

      {/* Conversation List */}
      <div
        id="scrollableDiv"
        className="flex-1 overflow-y-auto py-3 px-2 h-[calc(100vh-60px-55px)] lg:h-[calc(100vh-48px)] scroll-container-light dark:scroll-container"
      >
        {!user ? (
          <div className="flex items-center justify-center py-8 h-full">
            <div className="loader4"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-blue-500 text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={conversations.length}
            next={loadMore}
            hasMore={!!hasMore}
            style={{height: "100%", overflow: "hidden", padding: "0.8rem 0rem", display: "flex", flexDirection: "column", gap: "0.35rem"}}
            loader={
              loading && (
                <div className="py-4 flex items-center justify-center">
                  <div className="loader4"></div>
                </div>
              )
            }
            endMessage={
              <div className="py-4 text-center">
                <span className="text-xs text-gray-400">
                  No more conversations
                </span>
              </div>
            }
            scrollableTarget="scrollableDiv"
          >
              {conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  currentUserId={user?.id}
                />
              ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default ConversationsBar;
