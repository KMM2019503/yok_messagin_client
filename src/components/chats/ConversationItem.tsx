"use client";

import React, { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { Avatar } from "../ui/Avatar";
import { AvatarImage } from "../ui/AvatarImage";
import { AvatarFallback } from "../ui/AvatarFallback";
import { Conversation } from "@/type/conversation.type";
import { usePathname, useRouter } from "next/navigation";
import { useSelectedConversationStore } from "@/stores/selected-covnersation-store";
import { useSocketStore } from "@/stores/socket-store";

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId?: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { checkUserOnlineStatus, onlineUser } = useSocketStore();

  const { changeSelectedConversation } = useSelectedConversationStore();
  const [isUserActive, setIsUserActive] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(pathname.includes(conversation.id));
  }, [pathname, conversation.id]);

  const handleClickConversation = () => {
    changeSelectedConversation(conversation);
    router.push(`/content/chats/${conversation.id}`);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const otherMember = conversation.members.find(
    (member) => member.userId !== currentUserId
  );

  useEffect(() => {
    if (otherMember) {
      setIsUserActive(checkUserOnlineStatus(otherMember.user.id));
    }
  }, [otherMember, onlineUser]);

  const displayName = otherMember?.user.userName || "Unknown User";
  const avatarSrc = otherMember?.user.profilePictureUrl;

  return (
    <div
      onClick={handleClickConversation}
      className={`w-full p-3 rounded-md glass-background cursor-pointer transition-colors duration-200
        hover:bg-white/65 dark:hover:bg-black/20 backdrop-blur-xl
        ${
          isActive
            ? "border-l-[2px] border-b-[2px] border-primaryLight-300 !bg-white/50 dark:!bg-black/20 dark:border-primaryLight2-600 dark:bg-primaryLight2-800"
            : ""
        }
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage
              src={avatarSrc || "https://avatar.iran.liara.run/public/"}
              alt={displayName}
            />
            <AvatarFallback className="text-sm">
              <IoPersonCircle className="size-10 text-primaryLight-600" />
            </AvatarFallback>
          </Avatar>
          {isUserActive && (
            <div className="bg-green-400 h-1 w-1 rounded-full absolute top-0 right-0"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium primary-font-style">
              {displayName}{" "}
            </h3>
            {conversation.lastMessage?.createdAt && (
              <span className="text-[10px] text-muted-foreground">
                {formatTime(conversation.lastMessage.createdAt)}
              </span>
            )}
          </div>
          {conversation.lastMessage?.content && (
            <p className="text-xs secondary-font-style truncate">
              {conversation.lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
