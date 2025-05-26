import React from "react";
import { Avatar } from "./Avatar";
import { AvatarImage } from "./AvatarImage";
import { AvatarFallback } from "./AvatarFallback";
import { cn } from "@/lib/utils";

const ReuseAbleImage = ({
  url,
  alt,
  extraClassName,
}: {
  url: string;
  alt: string;
  extraClassName?: string;
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  return (
    <Avatar className={cn(`size-12 rounded-full`, extraClassName)}>
      <AvatarImage src={url ?? undefined} alt={alt} />
      <AvatarFallback className="bg-primaryLight-300 dark:bg-primaryDark-500 text-primaryLight-900 dark:text-primaryDark-100">
        {getInitials(alt)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ReuseAbleImage;
