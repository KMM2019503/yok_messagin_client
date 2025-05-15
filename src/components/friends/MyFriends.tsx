import React from "react";
import { UserType } from "./MyFriendsList";

import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui/Avatar";
import { AvatarImage } from "../ui/AvatarImage";
import { useSocketStore } from "@/stores/socket-store";
import { AvatarFallback } from "../ui/AvatarFallback";

const MyFriends = ({ user }: { user: UserType }) => {
  const { onlineUser } = useSocketStore();
  const [isOnline, setIsOnline] = React.useState(false);
  const checkOnlineUser = () => {
    setIsOnline(onlineUser.includes(user.id));
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
        <AvatarImage src={user.profilePictureUrl ?? undefined} alt={user.userName} />
        <AvatarFallback className="bg-primaryLight-300 dark:bg-primaryDark-500 text-primaryLight-900 dark:text-primaryDark-100">
          {getInitials(user.userName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 primary-font-style">
        <p className="text-sm font-medium truncate">{user.userName}</p>
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
    </div>
  );
};

export default MyFriends;
