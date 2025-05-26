import { outGoingRequestsType, RequestType } from "@/type/friend-request.type";
import { UserType } from "@/type/user.type";
import { create } from "zustand";

type FriendStoreType = {
  // My Friends
  myFriends: UserType[] | [];
  setMyFriends: (friends: UserType[]) => void;
  addFriend: (friend: UserType) => void;

  // Friend Requests
  requestList: RequestType[] | [];
  setRequestList: (requests: RequestType[]) => void;
  addRequest: (request: RequestType) => void;

  // Outgoing Friend Requests
  outGoingRequests: outGoingRequestsType[] | [];
  addOutGoingRequest: (request: outGoingRequestsType) => void;
  setOutGoingRequests: (requests: outGoingRequestsType[]) => void;

  // Util Functions
  checkIsFriends: (userId: string) => boolean;

  removeListItem: (id: string, type: "request" | "outgoing" | "friend") => void;
};

export const useFriendStore = create<FriendStoreType>((set, get) => ({
  // My Friends
  myFriends: [],
  setMyFriends: (friends: UserType[]) => set({ myFriends: friends }),
  addFriend: (friend: UserType) => {
    const { myFriends } = get();
    set({ myFriends: [friend, ...myFriends] });
  },

  //Friend Requests
  requestList: [],
  setRequestList: (requests: RequestType[]) => set({ requestList: requests }),
  addRequest: (request: RequestType) => {
    const { requestList } = get();
    set({ requestList: [request, ...requestList] });
  },

  // Outgoing Friend Requests
  outGoingRequests: [],
  setOutGoingRequests: (requests: outGoingRequestsType[]) =>
    set({ outGoingRequests: requests }),
  addOutGoingRequest: (request: outGoingRequestsType) => {
    const { outGoingRequests } = get();
    set({ outGoingRequests: [request, ...outGoingRequests] });
  },

  // Util Functions
  checkIsFriends: (userId: string) => {
    const { myFriends } = get();
    return myFriends.some((friend) => friend.id === userId);
  },

  removeListItem: (id: string, type: "request" | "outgoing" | "friend") => {
    if (type === "request") {
      set((state) => ({
        requestList: state.requestList.filter((request) => request.id !== id)
      }));
    }

    if (type === "outgoing") {
      set((state) => ({
        outGoingRequests: state.outGoingRequests.filter(
          (request) => request.id !== id
        )
      }));
    }

    if (type === "friend") {
      set((state) => ({
        myFriends: state.myFriends.filter((friend) => friend.id !== id)
      }));
    }
  }
}));
