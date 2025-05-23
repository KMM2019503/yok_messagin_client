"use client";
import React, { useState, useEffect } from "react";
import Divider from "../ui/Divider";
import { Loader2, Search } from "lucide-react";
import NewFriendCard from "./NewFriendCard";
import { UserType } from "@/type/user.type";

const NewFriends = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setNewUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchFriends();
      } else if (searchQuery.length <= 0) {
        setNewUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchFriends = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8888/v1/friends/find-friends?query=${searchQuery}`,
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
      setNewUsers(data.results || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[25.5rem] p-3 hidden lg:block h-full rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700">
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
        You can search and add friends
      </span>

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primaryLight-500 dark:text-primaryDark-400" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4 text-sm">
          {error}
          <button
            onClick={fetchFriends}
            className="text-primaryLight-500 dark:text-primaryDark-400 underline ml-1"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {users.map((user) => (
            <NewFriendCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewFriends;
