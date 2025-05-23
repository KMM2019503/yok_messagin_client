
import { outGoingRequestsType } from "@/type/friend-request.type";
import { UserType } from "@/type/user.type";
import { create } from "zustand";

type FriendStoreType = {
  myFriends: UserType[] | [];
  outGoingRequests: outGoingRequestsType[] | [];
  addOutGoingRequest: (request: outGoingRequestsType) => void;
  setMyFriends: (friends: UserType[]) => void;
  setOutGoingRequests: (requests: outGoingRequestsType[]) => void;
  checkIsFriends: (userId: string) => boolean;
};

export const useFriendStore = create<FriendStoreType>((set, get) => ({
  myFriends: [],
  outGoingRequests: [],
  setMyFriends: (friends: UserType[]) => set({ myFriends: friends }),
  setOutGoingRequests: (requests: outGoingRequestsType[]) => set({ outGoingRequests: requests }),
  addOutGoingRequest: (request: outGoingRequestsType) => {
    const { outGoingRequests } = get();
    set({ outGoingRequests: [request ,...outGoingRequests] });
  },
  checkIsFriends: (userId: string) => {
    const { myFriends } = get();
    return myFriends.some((friend) => friend.id === userId);
  },
}));

