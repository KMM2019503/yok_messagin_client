"use client";
import React from "react";
import Divider from "../ui/Divider";
import { Loader2, Search } from "lucide-react";
import MyFriends from "./MyFriends";
import { useFriendStore } from "@/stores/friends";
import OutgoingRequestCard from "./OutgoingRequestCard";
import { motion, AnimatePresence } from "framer-motion";
import { container, item } from "./animation";

const OutGoingRequestsHistory = () => {
  const { outGoingRequests, setOutGoingRequests, updateOutGoingRequests } =
    useFriendStore();
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
  }, [fetchOutGoingRequestHistory, updateOutGoingRequests]);

  return (
    <div className="flex-1 h-full p-3 hidden lg:block rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700 shadow-sm">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primaryLight-500 dark:text-primaryLight2-500" />
        <input
          type="text"
          placeholder="Search History..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm primary-text-style bg-transparent border rounded-lg border-primaryLight-600 dark:border-primaryLight2-500 focus:outline-none focus:ring-1 focus:ring-primaryLight-700 dark:focus:ring-primaryLight2-700 placeholder-primaryLight-500 dark:placeholder-primaryLight2-500"
        />
      </div>

      <Divider className="my-2" />

      <span className="primary-font-style mb-2 text-sm flex items-center justify-start cursor-default">
        Outgoing Request List
      </span>

      <div className="overflow-y-visible">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <p className="text-primaryLight-700 dark:text-primaryDark-300 text-sm">
              {searchQuery
                ? "No matching requests found"
                : "Your outgoing request list is empty"}
            </p>
            {!searchQuery && (
              <button
                onClick={fetchOutGoingRequestHistory}
                className="text-sm text-primaryLight-500 dark:text-primaryDark-400 hover:underline mt-1"
              >
                Refresh
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2 pr-1 custom-scrollbar"
          >
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((request) => (
                <motion.div
                  key={request.id}
                  variants={item}
                  layout
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  transition={{ type: "spring" }}
                >
                  <OutgoingRequestCard request={request} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OutGoingRequestsHistory;
