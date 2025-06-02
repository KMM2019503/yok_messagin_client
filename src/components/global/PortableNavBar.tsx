"use client";

import { useAuthStore } from "@/providers/auth-store-provider";
import { Fingerprint, LogOut } from "lucide-react";
import ThemeSwitcher from "../ThemeSwitch";
import LinkButton from "../ui/link";
import { Avatar } from "../ui/Avatar";
import { AvatarImage } from "../ui/AvatarImage";
import { useSocketStore } from "@/stores/socket-store";
import { useToast } from "@/hooks/use-toast";
import { error } from "console";

const PortableNavBar = () => {
  const { toast } = useToast();

  const { user, isAuthenticated } = useAuthStore((state) => state);
  const { disconnect } = useSocketStore();

  const handleLogout = async () => {
    try {
      disconnect();
      const response = await fetch("http://localhost:8888/v1/logout", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const res: {
        success: boolean;
        message: string;
      } = await response.json();

      if (res.success) {
        toast({
          title: "Successful",
          description:
            "You have been logged out successfully.",
        });
        // Handle successful logout (e.g., redirect, clear storage)
        console.log("Logout successful:", res.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Internal Server Error",
      });
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="absolute top-0 right-0 z-50 p-2">
      <div className="group flex justify-center items-center relative w-10 h-10 hover:h-12 hover:w-64 transition-all duration-300 ease-in-out bg-primaryLight-100 dark:bg-primaryLight2-700 rounded-full overflow-hidden pl-2 py-2 pr-4 shadow-md cursor-pointer font-mono">
        {/* Avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 group-hover:hidden transition-all duration-1000 ease-in-out">
          {user?.profilePictureUrl ? (
            <div className="flex items-center justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.profilePictureUrl ?? undefined}
                  alt={user?.userName}
                />
              </Avatar>
            </div>
          ) : (
            <Fingerprint className="size-6 primary-text-style" />
          )}
        </div>

        {/* Expandable content */}
        <div className="flex justify-between w-full overflow-hidden opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap">
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-sm primary-text-style">
              {isAuthenticated ? user?.userName : "No One"}
            </h4>
            <span className="text-xs font-bold primary-text-style">
              ({isAuthenticated ? user?.userUniqueID : "NtN"})
            </span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <ThemeSwitcher />
            <LinkButton
              icon={<LogOut className="size-[1rem]" />}
              type="button"
              className="px-1 rounded-3xl"
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortableNavBar;
