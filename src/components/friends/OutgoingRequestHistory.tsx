"use client";
import React from "react";
import Divider from "../ui/Divider";
import { Loader2, Search } from "lucide-react";
import MyFriends from "./MyFriends";
import { useFriendStore } from "@/stores/friends";
import OutgoingRequestCard from "./OutgoingRequestCard";

const OutGoingRequestsHistory = () => {
    const { outGoingRequests, setOutGoingRequests } = useFriendStore();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
  
    const filteredRequests = outGoingRequests.filter((request) =>
      request.receiver.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const fetchOutGoingRequestHistory = React.useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "http://localhost:8888/v1/friends/get-outgoing-friend-requests",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (!res.ok) {
          throw new Error(res.statusText || "Failed to fetch friends");
        }
  
        const data = await res.json();
        console.log("🚀 ~ fetchOutGoingRequestHistory ~ data:", data);
        setOutGoingRequests(data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }, []);
  
    React.useEffect(() => {
      fetchOutGoingRequestHistory();
    }, [fetchOutGoingRequestHistory]);
  
    return (
      <div className="w-[17.5rem] p-3 hidden lg:block h-full rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700 shadow-sm">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primaryLight-500 dark:text-primaryDark-400" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border border-primaryLight-600 dark:border-primaryLight2-500 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primaryLight2-300 dark:focus:ring-primaryDark-500 primary-text-style placeholder-primaryLight-500 dark:placeholder-primaryDark-400"
          />
        </div>
  
        <Divider className="my-2" />
  
        <span className="primary-font-style mb-2 text-sm flex items-center justify-start cursor-default">
          Outgoing Request List
        </span>
  
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primaryLight-500 dark:text-primaryDark-400 mb-2" />
            <p className="text-primaryLight-700 dark:text-primaryDark-300 text-sm">
              Loading History...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <button
              onClick={fetchOutGoingRequestHistory}
              className="text-sm text-primaryLight-500 dark:text-primaryDark-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-primaryLight-700 dark:text-primaryDark-300 text-sm">
              {searchQuery ? "No matching requests found" : "Your outgoing request list is empty"}
            </p>
            {!searchQuery && (
              <button
                onClick={fetchOutGoingRequestHistory}
                className="text-sm text-primaryLight-500 dark:text-primaryDark-400 hover:underline mt-1"
              >
                Refresh
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)] pr-1 custom-scrollbar">
            {filteredRequests.map((request) => (
              <OutgoingRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    );
  };
  
export default OutGoingRequestsHistory;

