"use client";
import FriendRequestLists from "@/components/friends/FriendRequestLists";
import MyFriendsList from "@/components/friends/MyFriendsList";
import NewFriends from "@/components/friends/NewFriends";
import OutGoingRequestsHistory from "@/components/friends/OutgoingRequestHistory";
import PortableNavBar from "@/components/global/PortableNavBar";
import React, { useEffect } from "react";

const Friends = () => {
  return (
    <div className="w-full lg:w-[50%] grid grid-cols-1 lg:grid-cols-2 grid-rows-2 items-center gap-1">
      <MyFriendsList />
      <NewFriends />
      <FriendRequestLists />
      <OutGoingRequestsHistory />
      <PortableNavBar />
    </div>
  );
};

export default Friends;
