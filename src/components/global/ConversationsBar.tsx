import React from "react";
import LinkButton from "../ui/link";
import { MdOutlineGroup, MdOutlineGroups } from "react-icons/md";
import { GiGroupedDrops } from "react-icons/gi";
import { RiGlobalFill } from "react-icons/ri";
import Divider from "../ui/Divider";

const ConversationsBar = () => {
  
  return (
    <div className="w-[14.5rem] hidden lg:block h-full rounded-lg bg-primaryLight-100 dark:bg-primaryLight2-700">
      <div className="flex items-center justify-between py-[0.5rem] px-[0.8rem]">
        <LinkButton icon={<RiGlobalFill className="size-4" />} type="link" />
        <LinkButton icon={<MdOutlineGroup className="size-4" />} type="link" />
        <LinkButton icon={<MdOutlineGroups className="size-4" />} type="link" />
        <LinkButton icon={<GiGroupedDrops className="size-4" />} type="link" />
      </div>
      {/* Divider */}
      <Divider thickness={2} />
    </div>
  );
};

export default ConversationsBar;
