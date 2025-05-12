"use client";

import { useAuthStore } from "@/providers/auth-store-provider";
import { Fingerprint, LogOut } from "lucide-react";
import ThemeSwitcher from "../ThemeSwitch";
import Link from "next/link";

const PortableNavBar = () => {
  const { user, isAuthenticated } = useAuthStore((state) => state);

  return (
    <div className="absolute top-0 right-0 z-50 p-2">
      <div className="group relative w-10 h-10 hover:h-12 hover:w-64 transition-all duration-300 ease-in-out bg-primaryLight-300 dark:bg-primaryDark-300 rounded-full overflow-hidden flex items-center pl-2 py-2 pr-4 shadow-md cursor-pointer font-mono">
        {/* Avatar */}
        <div className="size-6 flex items-center justify-center text-2xl text-purple-700">
          <Fingerprint className="size-6" />
        </div>

        {/* Expandable content */}
        <div className="ml-2 flex justify-between w-full overflow-hidden opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap">
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-sm">
              {isAuthenticated ? user?.userName : "No One"}
            </h4>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
              ({isAuthenticated ? user?.userUniqueID : "NtN"})
            </span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <ThemeSwitcher />
            <Link
              href="/auth/logout"
              className="border flex items-center justify-center rounded-sm py-1 px-[0.15rem] border-neutral-400 dark:border-purple-700"
            >
              <LogOut className="size-4 text-neutral-600 dark:text-purple-700" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortableNavBar;
