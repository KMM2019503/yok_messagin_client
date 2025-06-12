"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import Message from "./Message";
import { MessageType } from "@/type/message.type";
import { selectedConversationStore } from "@/stores/selected-covnersation-store";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash/debounce";

const ChatMessages = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [cursorId, setCursorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedConversation } = selectedConversationStore();

  const generateUrl = useCallback(
    (cursorId?: string) => {
      const base = `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/get-messages/${selectedConversation?.id}?take=20`;
      return cursorId ? `${base}&cursorId=${cursorId}` : base;
    },
    [selectedConversation]
  );

  const fetchMessages = useCallback(async () => {
    if (loading || !hasMore || !selectedConversation) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(generateUrl(cursorId ?? ""), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to load messages");

      const data = await res.json();
      const newMessages: MessageType[] = data.messages || [];

      if (newMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...prev, ...newMessages]);
        const lastMsg: MessageType = newMessages[newMessages.length - 1];
        if (lastMsg.id) setCursorId(lastMsg.id);
        setHasMore(newMessages.length === 20);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [cursorId, hasMore, loading, generateUrl, selectedConversation]);

  const debouncedFetch = useMemo(() => {
    return debounce(fetchMessages, 700);
  }, [fetchMessages]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages([]);
      setCursorId(null);
      setHasMore(true);
      debouncedFetch();
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [selectedConversation]);

  return (
    <div
      id="chat-container"
      className="w-full overflow-y-auto flex flex-col-reverse p-2 md:px-4 md:py-3 scroll-container h-[calc(100vh-62px)] lg:h-[calc(100vh-12vh)]"
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={debouncedFetch}
        hasMore={hasMore}
        inverse={true}
        scrollThreshold="200px"
        loader={
          <div
            className="flex justify-center items-center"
            style={{ height: "100px" }}
          >
            <div className="loader4"></div>
          </div>
        }
        scrollableTarget="chat-container"
        style={{ display: "flex", flexDirection: "column-reverse" }}
        endMessage={
          <p className="mb-2 secondary-font-style text-xs text-center">
            No More Messages
          </p>
        }
      >
        {messages.map((message: MessageType, index) => (
          <Message
            key={message.id}
            message={message}
            nextMessageSenderId={messages[index + 1]?.senderId || null}
            previousMessageSenderId={messages[index - 1]?.senderId || null}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ChatMessages;
