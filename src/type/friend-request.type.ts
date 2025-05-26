import { UserType } from "./user.type";

export type outGoingRequestsType = {
  id: string;
  receiverId: string;
  senderId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  receiver: UserType;
}

export type RequestType = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Date;
  sender: UserType;
}