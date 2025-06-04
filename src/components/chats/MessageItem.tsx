"use client";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui/Avatar";
import { AvatarFallback } from "../ui/AvatarFallback";
import { useEffect, useState } from "react";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: {
    status: "SENT" | "DELIVERED" | "READ";
    seenUserIds: string[] | null;
  };
  senderId: string;
};

type MessageItemProps = {
  message: Message;
  isLast: boolean;
};

export default function MessageItem({ message, isLast }: MessageItemProps) {
  const [relativeTime, setRelativeTime] = useState<string | null>(null);
  useEffect(() => {
    setRelativeTime(
      formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    );
  }, [message.createdAt]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "READ":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
        return "→";
      case "DELIVERED":
        return "✓";
      case "READ":
        return "✓✓";
      default:
        return "○";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const getSenderInitials = (senderId: string) => {
    return senderId.slice(-2).toUpperCase();
  };

  return (
    <div className={`flex space-x-3 ${isLast ? "mb-4" : ""}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-xs bg-blue-500 text-white">
          {getSenderInitials(message.senderId)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            User {message.senderId.slice(-4)}
          </span>
          <span className="text-xs text-gray-500">{relativeTime ?? ""}</span>

          <Badge
            variant="secondary"
            className={`text-xs ${getStatusColor(message.status.status)}`}
          >
            {getStatusIcon(message.status.status)} {message.status.status}
          </Badge>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <p className="text-sm text-gray-900 whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {message.createdAt !== message.updatedAt && (
          <div className="mt-1">
            <span className="text-xs text-gray-400">
              Edited {formatTime(message.updatedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
