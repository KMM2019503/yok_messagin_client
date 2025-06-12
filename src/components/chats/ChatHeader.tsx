"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "../ui/Avatar";
import { AvatarFallback } from "../ui/AvatarFallback";
import { useSelectedConversationStore } from "@/stores/selected-covnersation-store";
import { useAuthStore } from "@/providers/auth-store-provider";
import { UserType } from "@/type/user.type";
import { AvatarImage } from "../ui/AvatarImage";
import { useSocketStore } from "@/stores/socket-store";
import { formatDistanceToNow } from "date-fns";
import { IoPersonCircle } from "react-icons/io5";

const ChatHeader = () => {
  const { selectedConversation } = useSelectedConversationStore();
  const { user: currentUser } = useAuthStore((state) => state);
  const { checkUserOnlineStatus } = useSocketStore();
  const [otherMember, setOtherMember] = useState<UserType | null>(null);

  useEffect(() => {
    if (selectedConversation?.members && currentUser) {
      const other = selectedConversation.members.find(
        (member) => member.user.id !== currentUser.id
      );
      let otherUser = other?.user;
      setOtherMember(otherUser || null);
    }
  }, [selectedConversation, currentUser]);

  const getDisplayName = () => otherMember?.userName || "Unknown User";

  const getLastActiveTime = (date?: Date | string) => {
    if (!date) return "Last seen: unknown";
    return `${formatTime(date.toString())}`;
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };
  return (
    <div className="w-full flex items-center justify-end space-x-3">
      <div className="flex flex-col text-end">
        <div className="flex items-center justify-end gap-x-2">
          {otherMember && checkUserOnlineStatus(otherMember.id) ? (
            <span className="text-green-600 text-[10px]">Active</span>
          ) : (
            <span className="primary-font-style text-xs secondary-font-style">
              {getLastActiveTime(otherMember?.lastActiveAt)}
            </span>
          )}
          <span className="primary-font-style text-lg font-semibold">
            {getDisplayName()}
          </span>
        </div>
        <span className="secondary-font-style text-xs bg-white/40 shadow-2xl  px-[4px] py-[1px] rounded-md">
          #{otherMember?.id}
        </span>
      </div>

      <Avatar className="w-10 h-10">
        <AvatarImage
          src={otherMember?.profilePictureUrl || "/placeholder.svg"}
          alt={getDisplayName()}
        />
        <AvatarFallback className="text-sm">
          <IoPersonCircle className="size-10 text-primaryLight-600" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ChatHeader;
