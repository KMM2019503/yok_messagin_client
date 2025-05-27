"use client";
import React from "react";
import { User, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import ReuseAbleImage from "../ui/ReuseAbleImage";
import { useToast } from "@/hooks/use-toast";
import { useFriendStore } from "@/stores/friends";

const OutgoingRequestCard = ({ request }: { request: any }) => {
  const { removeListItem } = useFriendStore();

  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const getStatusText = () => {
    switch (request.status) {
      case "PENDING":
        return "Pending";
      case "ACCEPTED":
        return "Accepted";
      case "REJECTED":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const handleCancelRequest = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:8888/v1/friends/cancel-friend-request`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: request.id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(res.statusText || "Failed to accept friend request");
      }

      const data = await res.json();

      if (data.request.id === request.id) {
        removeListItem(data.request.id, "outgoing");
        toast({
          title: "Friend request accepted",
          description: "You can now chat with " + request.sender.userName,
        });
      } else {
        throw new Error("Friend ID mismatch");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error accepting friend request",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center dark:bg-black/10 bg-white/35 hover:bg-white/65 dark:hover:bg-black/20 backdrop-blur-xl justify-between p-3 rounded-sm transition-colors"
      )}
    >
      <div className="flex w-full items-center justify-between space-x-3">
        <div className="flex flex-1 items-center space-x-3 border-t border-primaryLight-600 dark:border-primaryLight2-500">
          <div className="flex flex-1 flex-col justify-center items-start">
            <div className="flex pt-2 items-center space-x-2">
              <p className="text-sm font-mono font-medium primary-font-style">
                {request.receiver.userName}
              </p>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs secondary-font-style">
                Request send at{" "}
                {new Date(request.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              {request.status === "PENDING" ? (
                <span className="text-xs secondary-font-style">
                  {request.receiver.userName} does not respond yet
                </span>
              ) : (
                <span className="text-xs secondary-font-style">
                  {getStatusText()} at{" "}
                  {new Date(request.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="relative p-2">
          <ReuseAbleImage
            url={request.receiver.profilePictureUrl}
            alt={request.receiver.userName}
            extraClassName="size-10"
          />
        </div>
      </div>

      {request.status === "PENDING" && (
        <Button
          disabled={isLoading}
          size="sm"
          className="text-xs text-white/80 dark:text-white/60 w-full my-2 bg-primaryLight-500 hover:bg-primaryLight-600 dark:bg-primaryLight2-400 dark:hover:bg-primaryLight2-500"
          onClick={handleCancelRequest}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default OutgoingRequestCard;
