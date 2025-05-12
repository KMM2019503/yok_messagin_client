import React from "react";
import { LogOut } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Handshake } from "lucide-react";
import { Cog } from "lucide-react";
import LinkButton from "../ui/link";
import IconButton from "../ui/icon-button";

const SideBar = () => {
  return (
    <>
      <div className="w-[2.5rem] h-screen bg-primaryLight-300 dark:bg-[#22223b] p-4 flex flex-col justify-between items-center text-center shadow-2xl">
        <h1 className="text-lg font-bold font-mono ">TY</h1>
        <ul className="space-y-2 text-sm text-left">
          <li>
            <LinkButton
              type="icon"
              icon={<MessageCircle className="size-4 " />}
            />
          </li>
          <li>
            <LinkButton
              type="icon"
              icon={<Handshake className="size-4 " />}
            />
          </li>
          <li>
            <LinkButton
              type="icon"
              icon={<Cog className="size-4 " />}
            />
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
