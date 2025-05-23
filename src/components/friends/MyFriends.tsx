import React from "react";

import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui/Avatar";
import { AvatarImage } from "../ui/AvatarImage";
import { useSocketStore } from "@/stores/socket-store";
import { AvatarFallback } from "../ui/AvatarFallback";
import { UserType } from "@/type/user.type";

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
    <div className="flex items-center p-2 dark:bg-black/10 bg-white/35 hover:bg-white/65 dark:hover:bg-black/20 backdrop-blur-xl rounded-lg transition-colors cursor-pointer">
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
    </div>
  );
};

export default MyFriends;
