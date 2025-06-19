import React, { useEffect, useState } from "react";

// icon //
import { VscSend } from "react-icons/vsc";
// store //
import { selectedConversationStore } from "@/stores/selected-covnersation-store";
import { useAuthStore } from "@/providers/auth-store-provider";
import { useMessageStore } from "@/stores/messages"; 
// type //
import { UserType } from "@/type/user.type";
import { useConversationsStore } from "@/stores/conversations-store";

const MessageSendingBox = () => {
  // stores //
  const { selectedConversation } = selectedConversationStore();
  const {updateLastMessage} = useConversationsStore();
  const { user: currentUser } = useAuthStore((state) => state);
  const {addMessages} = useMessageStore();

  // components state
  const [otherMember, setOtherMember] = useState<UserType | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !otherMember?.id || !selectedConversation?.id) {
      setError("Message cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
        if (!otherMember.id) {
           throw new Error("other member id is null") 
        }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/messages/direct-message`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: messageContent,
            receiverId: otherMember?.id,
            conversationId: selectedConversation?.id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      // Clear the input field after successful send
      setMessageContent("");

      const data = await res.json();
      if (currentUser) {
          addMessages({
            ...data.message,
            senderId: currentUser.id
          });
          updateLastMessage(selectedConversation.id, {
            content: data.message.content,
            createdAt: data.message.createdAt,
            senderId: currentUser.id,
          })
      }
    } catch (error) {
      console.log("🚀 ~ handleSendMessage ~ error:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (selectedConversation?.members && currentUser) {
      const other = selectedConversation.members.find(
        (member) => member.user.id !== currentUser.id
      );
      let otherUser = other?.user;
      setOtherMember(otherUser || null);
    }
  }, [selectedConversation, currentUser]);

  return (
    <div className="flex items-center w-full h-full p-1 lg:p-2">
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-3 text-sm md:text-base font-normal h-full primary-font-style font-sans rounded-md rounded-tr-none rounded-br-none focus:ring-0 focus:outline-none"
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <button
        onClick={handleSendMessage}
        disabled={isLoading || !messageContent.trim()}
        className="px-3 group py-1 md:py-2 h-full glass-background !bg-primaryLight-300 !shadow-none rounded-md rounded-tl-none rounded-bl-none disabled:opacity-50"
      >
        <VscSend className="size-5 md:size-6 primary-text-style !text-primaryLight2-300 group-focus:scale-110 transition" />
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default MessageSendingBox;