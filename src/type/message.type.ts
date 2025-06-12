export type MessageType = {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  status: {
    status: "SENT" | "DELIVERED" | "READ"
    seenUserIds: string[] | null
  }
  senderId: string
}