"use client";
import React, { useState, useEffect } from "react";
import Divider from "../ui/Divider";
import { Loader2, Search } from "lucide-react";
import NewFriendCard from "./NewFriendCard";
import { UserType } from "@/type/user.type";
import { motion, AnimatePresence } from "framer-motion";
import { container, item } from "./animation";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const NewFriends = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setNewUsers] = useState<UserType[]>([]);
  const [locationBaseUsers, setLocationBaseUsers] = useState<UserType[]>([]); // Assuming you have a friends state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    if (isOpen) {
      checkLocationPermission();
    }
  }, [isOpen]);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Warning",
        description:
          "Geolocation is not supported by your browser. Please use a modern browser.",
      });
      setLocationAllowed(false);
      return;
    }

    try {
      // Check permission state
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "granted") {
        console.log("state", permissionStatus.state);
        getUserLocation();
      } else if (permissionStatus.state === "prompt") {
        // Permission hasn't been asked yet
        requestLocationPermission();
      } else {
        // Permission was denied
        toast({
          title: "Warning",
          description:
            "Location permission was denied. Please enable it in your browser settings.",
        });
        setLocationAllowed(false);
      }

      // Listen for changes in permission status
      permissionStatus.onchange = () => {
        if (permissionStatus.state === "granted") {
          setLocationAllowed(true);
          getUserLocation();
        } else {
          setLocationAllowed(false);
        }
      };
    } catch (error) {
      console.error("Error checking location permission:", error);
      // Fallback for browsers that don't support permissions API
      requestLocationPermission();
    }
  };

  const requestLocationPermission = () => {
    toast({
      title: "Warning",
      description:
        "This feature requires your location. Please allow location access.",
    });
    getUserLocation();
  };

  const getUserLocation = () => {
    // Set loading first
    setLoading(true);
    // Update locationAllowed immediately
    setLocationAllowed(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Make callback async
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(currentLocation);

        // Now call handleNearUsers with the certainty that location is allowed
        await handleNearUsers(currentLocation);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationAllowed(false);
        setLoading(false);
        toast({
          title: "Error",
          description:
            "Failed to get location. Please enable location services.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNearUsers = async (currentLocation: any) => {
    try {
      console.log(
        "Location is allowed when fetching nearby users:",
        locationAllowed
      );

      const res = await fetch(
        `http://localhost:8888/v1/friends/get-users-nearby-location`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: {
              latitude: currentLocation?.lat,
              longitude: currentLocation?.lng,
            },
            maxDistance: 20,
          }),
        }
      );

      const data = await res.json();
      setIsLocationFetched(true);
      setLocationAllowed(true);
      setLocationBaseUsers(data.users || []);
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

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
    <div className="overflow-hidden flex flex-col flex-1 p-3 h-[calc(100vh-50vh-20px)] rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700 shadow-sm">
      {/* Search Bar */}
      <div>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="sm"
          className="text-xs text-white/80 dark:text-white/60 w-full my-2 bg-primaryLight-500 hover:bg-primaryLight-600 dark:bg-primaryLight2-400 dark:hover:bg-primaryLight2-500"
        >
          {!isOpen ? "Location Search" : "Search Friends"}
        </Button>
      </div>

      {!isOpen && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primaryLight-500 dark:text-primaryLight2-500" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm primary-text-style bg-transparent border rounded-lg border-primaryLight-600 dark:border-primaryLight2-500 focus:outline-none focus:ring-1 focus:ring-primaryLight-700 dark:focus:ring-primaryLight2-700 placeholder-primaryLight-500 dark:placeholder-primaryLight2-500"
          />
        </div>
      )}

      {!isOpen && <Divider className="my-2" />}

      {!isOpen && (
        <span className="primary-font-style mb-2 text-sm flex items-center justify-start cursor-default">
          You can search and add friends
        </span>
      )}
      {!isOpen ? (
        <div className="flex-1 overflow-y-auto scroll-container pr-2">
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
            <div className="flex flex-col gap-y-1">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                <AnimatePresence mode="popLayout">
                  {users.map((user) => (
                    <motion.div
                      key={user.id}
                      variants={item}
                      layout
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      transition={{ type: "spring" }}
                    >
                      <NewFriendCard user={user} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scroll-container pr-2">
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : isLocationFetched ? (
            locationBaseUsers.length === 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  No users found near your location. Please try again later.
                </p>
                <button
                  onClick={handleNearUsers}
                  className="text-sm text-primaryLight-500 dark:text-primaryDark-400 hover:underline mt-1"
                >
                  Refresh
                </button>
              </div>
            )
          ) : (
            locationAllowed && (
              <div className="flex items-center justify-between">
                <p className="text-xs">
                  Please enable location access to use this feature.
                </p>
                <Button onClick={requestLocationPermission} size="sm">
                  Allow Location
                </Button>
              </div>
            )
          )}
          <Divider className="my-2" />
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {locationBaseUsers.map((user) => (
                <motion.div
                  key={user.id}
                  variants={item}
                  layout
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  transition={{ type: "spring" }}
                >
                  <NewFriendCard user={user} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NewFriends;
