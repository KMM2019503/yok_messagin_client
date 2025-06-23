"use client";
// React Hook
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Node Module
import debounce from "lodash/debounce";

// Store
import { selectedConversationStore } from "@/stores/selected-covnersation-store";
import { useMessageStore } from "@/stores/messages";

// Type
import { MessageType } from "@/type/message.type";

// Components
import InfiniteScroll from "react-infinite-scroll-component";
import Message from "./Message";
import MessageSendingBox from "./MessageSendingBox";

const ChatMessages = () => {
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ref //
  const cursorIdRef = useRef<string | null>(null);
  const loadingRef = useRef(false);

  const selectedConversationId = selectedConversationStore(
    (state) => state.selectedConversation?.id
  );
  const { messages, appendMessages, clearMessages } = useMessageStore();

  const generateUrl = useCallback(
    (cursorId?: string) => {
      const base = `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/get-messages/${selectedConversationId}?take=20`;
      return cursorId ? `${base}&cursorId=${cursorId}` : base;
    },
    [selectedConversationId]
  );

  const fetchMessages = async () => {
    if (loadingRef.current || !hasMore || !selectedConversationId) return;
    loadingRef.current = true;

    setError(null);

    try {
      const res = await fetch(generateUrl(cursorIdRef.current ?? ""), {
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
        appendMessages(newMessages);
        const lastMsg: MessageType = newMessages[newMessages.length - 1];
        if (lastMsg.id) cursorIdRef.current = lastMsg.id;
        setHasMore(newMessages.length === 20);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      loadingRef.current = false;
    }
  };

  const debouncedFetchRef = useRef(debounce(() => fetchMessages(), 700));

  useEffect(() => {
    if (selectedConversationId) {
      cursorIdRef.current = null;
      setHasMore(true);
      fetchMessages();
    }

    return () => {
      clearMessages();
      debouncedFetchRef.current.cancel();
    };
  }, [selectedConversationId]);

  return (
    <div className="flex flex-col h-full w-full">
      <div
        id="chat-container"
        className="flex-1 w-full overflow-y-auto flex flex-col-reverse p-2 md:px-4 md:py-3 scroll-container"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={debouncedFetchRef.current}
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
      {/* Sending messaging box */}
      <div className="px-2 pt-1 pb-2 md:px-3 flex-shrink-0">
        <MessageSendingBox />
      </div>
    </div>
  );
};

export default ChatMessages;
