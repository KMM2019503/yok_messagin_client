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
        className={`w-full h-[calc(100vh - 1rem)] bg-primaryLight-100 dark:bg-primaryLight2-700 py-[0.3rem] lg:py-[1rem] px-[0.2rem] flex lg:flex-col justify-between items-center text-center shadow-2xl transition-all duration-300 ease-in-out ${
          isExpanded ? "lg:w-[8rem]" : "lg:w-[2.2rem]"
        }`}
      >
        <div className="lg:hidden relative size-[2.2rem] rounded-full overflow-hidden">
          <Image
            src="/images/logo.png"
            alt="logo"
            fill
            className="object-cover"
          />
        </div>
        {/* This is menu icon */}
        <div className="hidden lg:block">
          {!isExpanded ? (
            <LinkButton
              icon={<MdOutlineKeyboardDoubleArrowRight className="size-3" />}
              type="button"
              className="px-1 rounded-3xl"
              onClick={() => setIsExpanded(!isExpanded)}
            />
          ) : (
            <LinkButton
              icon={<MdOutlineKeyboardDoubleArrowLeft className="size-3" />}
              type="button"
              className="px-1 rounded-3xl"
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
        </div>

        <ul className="text-sm w-full text-left flex justify-center gap-x-5 lg:gap-0 lg:block gap-2 lg:space-y-2">
          <li>
            <SidebarLinkButton
              className="rounded-full"
              icon={<MessageCircle className="size-4" />}
              label={isExpanded ? "Chats" : ""}
              isExpanded={isExpanded}
            />
          </li>
          <li>
            <SidebarLinkButton
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

        <div>
          <LinkButton
            icon={<Settings className="size-[0.6rem]" />}
            type="button"
            className="px-1 rounded-3xl"
            onClick={() => {
              console.log("Logout");
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SideBar;
