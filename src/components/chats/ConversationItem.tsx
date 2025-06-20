"use client";

import React, { useEffect } from "react";
import { Users } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { AvatarImage } from "../ui/AvatarImage";
import { AvatarFallback } from "../ui/AvatarFallback";
import { Conversation } from "@/type/conversation.type";
import { usePathname, useRouter } from "next/navigation";
import { useSelectedConversationStore } from "@/stores/selected-covnersation-store";
import { IoPersonCircle } from "react-icons/io5";

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId?: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const { changeSelectedConversation  } = useSelectedConversationStore();
  
  const router = useRouter();
  const pathname = usePathname();

  const handleCheckIsActive = () => {
    if (pathname.includes(conversation.id)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  useEffect(() => {
    handleCheckIsActive();
  });

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
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getConversationType = (): "direct" | "group" => {
    return conversation.members.length === 2 ? "direct" : "group";
  };

  const getDisplayName = () => {
    if (getConversationType() === "group") {
      // Group chat - create a title from member names
      const memberNames = conversation.members
        .slice(0, 3)
        .map((member) => member.user.userName)
        .join(", ");

      if (conversation.members.length > 3) {
        return `${memberNames} and ${conversation.members.length - 3} others`;
      }
      return memberNames;
    }

    // Direct message - show the other participant's name
    const otherMember = conversation.members.find(
      (member) => member.userId !== currentUserId
    );
    return otherMember?.user.userName || "Unknown User";
  };

  const getAvatarSrc = () => {
    if (getConversationType() === "direct") {
      const otherMember = conversation.members.find(
        (member) => member.userId !== currentUserId
      );
      return otherMember?.user.profilePictureUrl;
    }
    return undefined;
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`
        w-full p-3 rounded-md glass-background cursor-pointer transition-colors duration-200
        hover:bg-white/65 dark:hover:bg-black/20 backdrop-blur-xl
        ${
          isActive
            ? "border-l-[2px] border-b-[2px] border-primaryLight-300 !bg-white/50 dark:!bg-black/20 dark:border-primaryLight2-600 dark:bg-primaryLight2-800"
            : ""
        }
      `}
      onClick={handleClickConversation}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={getAvatarSrc() || 'https://avatar.iran.liara.run/public/'}
              alt={getDisplayName()}
            />
            <AvatarFallback className="text-sm">
              <IoPersonCircle className="size-10 text-primaryLight-600"/>
            </AvatarFallback>
          </Avatar>
          {getConversationType() === "group" && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <Users className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium primary-font-style">
              {getDisplayName()}
            </h3>
            <div className="flex items-center space-x-2">
              {conversation.lastMessage?.createdAt && (
                <span className="text-xs text-[9px] secondary-font-style">
                  {formatTime(conversation.lastMessage.createdAt)}
                </span>
              )}
              {/* Unread count would need to be implemented separately */}
            </div>
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
