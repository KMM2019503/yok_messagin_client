import React, { useState } from "react";


import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui/Avatar";
import LinkButton from "../ui/link";
import { AvatarFallback } from "../ui/AvatarFallback";
import { AvatarImage } from "../ui/AvatarImage";
import { useFriendStore } from "@/stores/friends";
import { useSocketStore } from "@/stores/socket-store";
import { TiUserAdd, TiUser } from "react-icons/ti";
import { UserType } from "@/type/user.type";
import { useToast } from "@/hooks/use-toast";

const NewFriendCard = ({ user }: { user: UserType }) => {
  const { checkIsFriends, addOutGoingRequest } = useFriendStore();
  const [isSend, setIsSend] = useState(false);
  const isAlreadyFriend = checkIsFriends(user.id);
  const { onlineUser } = useSocketStore();
  const [isOnline, setIsOnline] = React.useState(false);
  const { toast } = useToast();
  const checkOnlineUser = () => {
    setIsOnline(onlineUser.includes(user.id));
  };
  const handleSendFriendRequest = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/v1/friends/send-friend-request`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiverId: user.id }),
        }
      );

      if (!res.ok) {
        throw new Error(res.statusText || "Failed to fetch friends");
      }

      const data = await res.json();
      if(data.message === 'Friend request sent successfully') {

        addOutGoingRequest(data.friendRequest);
        toast({
          title: "Successfully sent friend request"
        });
      }

      setIsSend(true);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
    }
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  React.useEffect(() => {
    checkOnlineUser();
  }, [onlineUser]);

  return (
    <div className="flex items-center p-2 hover:bg-primaryLight-200 dark:hover:bg-primaryLight2-800 rounded-lg transition-colors cursor-pointer">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage
          src={user.profilePictureUrl ?? undefined}
          alt={user.userName}
        />
        <AvatarFallback className="bg-primaryLight-300 dark:bg-primaryDark-500 text-primaryLight-900 dark:text-primaryDark-100">
          {getInitials(user.userName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 primary-font-style">
        <div className="flex items-center">
          <p className="text-sm font-medium truncate">{user.userName}</p>
          <span className="primary-font-style text-[11px]">
            ({user.userUniqueID})
          </span>
        </div>
        {isOnline ? (
          <p className="text-xs text-green-500 font-semibold">Online</p>
        ) : (
          <p className="text-xs truncate text-primaryLight-500 dark:text-primaryLight2-500">
            Last active{" "}
            {formatDistanceToNow(new Date(user.lastActiveAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>

      <div>
        {isAlreadyFriend || isSend ? (
          <LinkButton
            onClick={handleSendFriendRequest}
            type="button"
            icon={<TiUser className="size-5 primary-text-style" />}
            disabled={true}
          />
        ) : (
          <LinkButton
            onClick={handleSendFriendRequest}
            type="button"
            icon={<TiUserAdd className="size-5 primary-text-style" />}
            disabled={false}
          />
        )}
      </div>
    </div>
  );
};

export default NewFriendCard;
