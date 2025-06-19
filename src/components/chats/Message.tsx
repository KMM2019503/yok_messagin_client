import React, { useEffect, useState } from "react";
//store
import { useAuthStore } from "@/providers/auth-store-provider";
import { useSelectedConversationStore } from "@/stores/selected-covnersation-store";
//package
import { cn } from "@/lib/utils";
import {
  format,
  differenceInHours,
  formatDistanceToNowStrict,
} from "date-fns";
//Components
import { Avatar } from "../ui/Avatar";
import { AvatarImage } from "../ui/AvatarImage";
import { AvatarFallback } from "../ui/AvatarFallback";
// Icon
import { IoPersonCircle } from "react-icons/io5";
import { BsFillSendCheckFill } from "react-icons/bs";
//Type
import { MessageType } from "@/type/message.type";
import { UserType } from "@/type/user.type";

const Message = ({
  message,
  nextMessageSenderId,
  previousMessageSenderId,
}: {
  message: MessageType;
  nextMessageSenderId: string | null;
  previousMessageSenderId: string | null;
}) => {
  const { selectedConversation } = useSelectedConversationStore();
  const { user } = useAuthStore((state) => state);

  const [currentMessageUser, setCurrentMessageUser] = useState<UserType | null>(
    null
  );
  const [otherMember, setOtherMember] = useState<UserType | null>(null);
  const [isAuthUserSender, setIsAuthUserSender] = useState<boolean>(false);

  useEffect(() => {
    if (selectedConversation?.members && user) {
      const other = selectedConversation.members.find(
        (member) => member.user.id !== user.id
      );
      let otherUser = other?.user || null;
      setOtherMember(otherUser);

      if (message.senderId === user.id) {
        setIsAuthUserSender(true);
        setCurrentMessageUser(user);
      } else {
        setIsAuthUserSender(false);
        setCurrentMessageUser(otherUser);
      }
    }
  }, [selectedConversation, user, message.senderId]);

  const shouldShowAvatar = message.senderId !== nextMessageSenderId;

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();

      const hoursDiff = differenceInHours(now, date);

      if (hoursDiff >= 1) {
        return format(date, "MMM d, yyyy h:mm a");
      }

      return formatDistanceToNowStrict(date, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2.5 mb-4",
        isAuthUserSender ? "justify-end" : "justify-start",
        !shouldShowAvatar && (isAuthUserSender ? "" : "ml-12")
      )}
    >
      {!isAuthUserSender && shouldShowAvatar && (
        <Avatar className="w-10 h-10 clear-glass-background ">
          <AvatarImage
            src={
              currentMessageUser?.profilePictureUrl ||
              "https://avatar.iran.liara.run/public/"
            }
            alt={message.id + currentMessageUser?.userName}
          />
          <AvatarFallback className="text-sm">
            <IoPersonCircle className="size-10 text-primaryLight-600" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-64 md:max-w-80 flex flex-col",
          shouldShowAvatar && "mt-5",
          isAuthUserSender && "pr-2"
        )}
      >
        <div
          className={cn(
            "px-3.5 py-[0.5rem] chat-background rounded-xl justify-start items-center gap-3 inline-flex",
            shouldShowAvatar
              ? isAuthUserSender
                ? "rounded-tr-none"
                : "rounded-tl-none"
              : ""
          )}
        >
          <span className="primary-font-style text-sm font-normal">
            {message.content}
          </span>
        </div>

        {message.senderId !== previousMessageSenderId && (
          <div
            className={cn(
              "flex w-full items-center gap-2 mb-2.5 h-full p-[0.10rem]",
              isAuthUserSender ? "justify-start" : "justify-end"
            )}
          >
            <span className="secondary-font-style text-xs font-normal leading-4 py-1">
              {formatTime(message.createdAt)}
            </span>
            {message.status.status === "SENT" && (
              <BsFillSendCheckFill className="size-4 secondary-font-style" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
