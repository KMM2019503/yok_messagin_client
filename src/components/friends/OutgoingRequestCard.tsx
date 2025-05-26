"use client";
import React from "react";
import { User, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import ReuseAbleImage from "../ui/ReuseAbleImage";

const OutgoingRequestCard = ({ request }: { request: any }) => {
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

  return (
    <div
      className={cn(
        "flex items-center dark:bg-black/10 bg-white/35 hover:bg-white/65 dark:hover:bg-black/20 backdrop-blur-xl justify-between p-3 rounded-sm transition-colors"
      )}
    >
      <div className="flex items-center space-x-3 border-t border-primaryLight-600 dark:border-primaryLight2-500">
        <div>
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
          {/* {request.status === "PENDING" && (
            <Button
              size="sm"
              className="text-xs text-white/80 dark:text-white/60 w-full my-2 bg-primaryLight-500 hover:bg-primaryLight-600 dark:bg-primaryLight2-400 dark:hover:bg-primaryLight2-500"
              onClick={() => {
              }}
            >
              Cancel
            </Button>
          )} */}
        </div>
      </div>
      <div className="relative p-2">
          <ReuseAbleImage
            url={request.receiver.profilePictureUrl}
            alt={request.receiver.userName}
          />
      </div>
    </div>
  );
};

export default OutgoingRequestCard;
