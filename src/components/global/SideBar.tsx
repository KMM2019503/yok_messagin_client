import React from "react";
import { LogOut } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Handshake } from "lucide-react";
import { Cog } from "lucide-react";
import LinkButton from "../ui/link";
import IconButton from "../ui/icon-button";
import Image from "next/image";

const SideBar = () => {
  return (
    <>
      <div className="w-full h-auto lg:w-[2.5rem] lg:h-screen bg-[#a2d2ff] dark:bg-[#22223b] p-2 lg:p-3 flex lg:flex-col justify-between items-center text-center shadow-2xl">
        <div className="relative size-[2.2rem] rounded-full overflow-hidden">
          <Image
            src="/images/logo.png"
            alt="logo"
            fill
            className="object-cover" // or "object-cover"
          />
        </div>

        <ul className="text-sm text-left flex lg:block gap-2 lg:space-y-2">
          <li>
            <LinkButton
              type="icon"
              icon={<MessageCircle className="size-4 " />}
            />
          </li>
          <li>
            <LinkButton type="icon" icon={<Handshake className="size-4 " />} />
          </li>
          <li>
            <LinkButton type="icon" icon={<Cog className="size-4 " />} />
          </li>
          {/* <li>Friends</li>
        <li>Settings</li> */}
        </ul>
        <div>
          <IconButton icon={<LogOut className="size-4 " />} />
        </div>
      </div>
    </>
  );
};

export default SideBar;
