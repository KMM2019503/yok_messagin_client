
import { outGoingRequestsType } from "@/type/friend-request.type";
import { UserType } from "@/type/user.type";
import { create } from "zustand";

type FriendStoreType = {
  myFriends: UserType[] | [];
  outGoingRequests: outGoingRequestsType[] | [];
  setMyFriends: (friends: UserType[]) => void;
  setOutGoingRequests: (requests: outGoingRequestsType[]) => void;
  checkIsFriends: (userId: string) => boolean;
};

export const useFriendStore = create<FriendStoreType>((set, get) => ({
  myFriends: [],
  outGoingRequests: [],
  setMyFriends: (friends: UserType[]) => set({ myFriends: friends }),
  setOutGoingRequests: (requests: outGoingRequestsType[]) => set({ outGoingRequests: requests }),
  checkIsFriends: (userId: string) => {
    const { myFriends } = get();
    return myFriends.some((friend) => friend.id === userId);
  },
}));

