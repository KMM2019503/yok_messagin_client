"use client";
import React, { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Handshake } from "lucide-react";
import { Cog } from "lucide-react";
import Image from "next/image";
import SidebarLinkButton from "../ui/sidebar-link";
import LinkButton from "../ui/link";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        className={`h-screen flex flex-col justify-between py-[1rem] lg:py-[1rem] px-[0.2rem] bg-primaryLight-400 dark:bg-primaryLight2-700 shadow-2xl transition-all duration-300 ease-in-out ${
          isExpanded ? "lg:w-[8rem]" : "lg:w-[2.2rem]"
        }`}
      >
        <div className="flex w-full justify-center relative size-[1.3rem] rounded-full overflow-hidden">
          <Image
            src="/images/logo.png"
            alt="logo"
            fill
            className="object-cover"
          />
        </div>
        {/* menu icon */}
        <div>
          <ul className="h-full flex flex-col gap-y-3">
            <li>
              <SidebarLinkButton
                className="rounded-full"
                href="/content/chats"
                icon={<MessageCircle className="size-4" />}
                label={isExpanded ? "Chats" : ""}
                isExpanded={isExpanded}
              />
            </li>
            <li>
              <SidebarLinkButton
                href="/content/friends"
                icon={<Handshake className="size-4" />}
                label={isExpanded ? "Friends" : ""}
                isExpanded={isExpanded}
              />
            </li>
            <li>
              <SidebarLinkButton
                icon={<Cog className="size-4" />}
                label={isExpanded ? "Settings" : ""}
                isExpanded={isExpanded}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
