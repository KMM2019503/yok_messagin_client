import React from "react";
import LinkButton from "../ui/link";
import { MdOutlineGroup, MdOutlineGroups } from "react-icons/md";
import { GiGroupedDrops } from "react-icons/gi";
import { RiGlobalFill } from "react-icons/ri";
import Divider from "../ui/Divider";
import { useAuthStore } from "@/providers/auth-store-provider";

const ConversationsBar = () => {
  const { user } = useAuthStore((state) => state);

  return (
    <div className="w-[20.5rem] hidden lg:block h-full rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700">
      <div className="grid grid-cols-3 justify-center items-center py-[0.5rem] px-[0.8rem]">
        <div className="flex items-center justify-center">
          <LinkButton icon={<RiGlobalFill className="size-4" />} type="link" />
        </div>
        <div className="flex items-center justify-center">
          <LinkButton
            icon={<MdOutlineGroup className="size-4" />}
            type="link"
          />
        </div>
        <div className="flex items-center justify-center">
          <LinkButton
            icon={<MdOutlineGroups className="size-4" />}
            type="link"
          />
        </div>
      </div>
      {/* Divider */}
      <Divider thickness={2} />
      <div className="mt-2 w-full flex flex-col items-center justify-center primary-font-style font-mono">
        {user ? <span>Conversation List</span> : <span>loading...</span>}
      </div>
    </div>
  );
};

export default ConversationsBar;
