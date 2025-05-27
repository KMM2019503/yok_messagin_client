"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import ReuseAbleImage from "../ui/ReuseAbleImage";
import { useToast } from "@/hooks/use-toast";
import { useFriendStore } from "@/stores/friends";

const RequestCard = ({ request }: { request: any }) => {
  const { addFriend, removeListItem } = useFriendStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAcceptRequest = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:8888/v1/friends/accept-friend-request`,
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

      if (data.requestId === request.id) {
        addFriend(data.sender);
        removeListItem(data.requestId, "request");
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

  const handleRejectRequest = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:8888/v1/friends/reject-friend-request`,
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
        throw new Error(res.statusText || "Failed to reject friend request");
      }

      const data = await res.json();

      if (data.requestId === request.id) {
        removeListItem(request.id, "request");
        toast({
          title: "Friend request rejected",
          description: `You rejected ${request.sender.userName}'s request.`,
        });
      } else {
        throw new Error("Rejection failed");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error rejecting friend request",
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
      <div className="flex w-full justify-between">
        <div className="flex flex-1 items-start space-x-3 h-auto border-t border-dotted border-primaryLight-600 dark:border-primaryLight2-500">
          <div className="flex flex-col items-start justify-center pr-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-mono font-medium primary-font-style">
                {request.sender.userName}
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
          </div>
        </div>
        <div className="relative p-2  border border-t-0 rounded-tr-md rounded-br-md bg-primaryLight-600 dark:bg-primaryLight2-500 rounded-bl-md border-primaryLight-600 dark:border-primaryLight2-500">
          <ReuseAbleImage
            url={request.sender.profilePictureUrl}
            alt={request.sender.userName}
            extraClassName="size-9"
          />
        </div>
      </div>
      <div className="flex items-center mt-2 gap-2 w-full">
        <Button
          disabled={isLoading}
          size="sm"
          className="text-xs text-white/80 dark:text-white/60 w-full my-2 bg-primaryLight-500 hover:bg-primaryLight-600 dark:bg-primaryLight2-400 dark:hover:bg-primaryLight2-500"
          onClick={handleRejectRequest}
        >
          Reject
        </Button>
        <Button
          disabled={isLoading}
          size="sm"
          className="text-xs text-white/80 dark:text-white/60 w-full my-2 bg-primaryLight-500 hover:bg-primaryLight-600 dark:bg-primaryLight2-400 dark:hover:bg-primaryLight2-500"
          onClick={handleAcceptRequest}
        >
          Accept
        </Button>
      </div>
    </div>
  );
};

export default RequestCard;
