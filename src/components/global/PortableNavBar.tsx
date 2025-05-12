"use client";

import { useAuthStore } from "@/providers/auth-store-provider";
import { Fingerprint, LogOut } from "lucide-react";
import ThemeSwitcher from "../ThemeSwitch";
import LinkButton from "../ui/link";

const PortableNavBar = () => {
  const { user, isAuthenticated } = useAuthStore((state) => state);

  return (
    <div className="absolute top-0 right-0 z-50 p-2">
      <div className="group relative w-10 h-10 hover:h-12 hover:w-64 transition-all duration-300 ease-in-out bg-primaryLight-100 dark:bg-primaryLight2-700 rounded-full overflow-hidden flex items-center pl-2 py-2 pr-4 shadow-md cursor-pointer font-mono">
        {/* Avatar */}
        <div className="size-6 flex items-center justify-center text-2xl">
          <Fingerprint className="size-6 primary-text-style" />
        </div>

        {/* Expandable content */}
        <div className="ml-2 flex justify-between w-full overflow-hidden opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap">
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
              onClick={() => {
                console.log("Logout");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortableNavBar;
