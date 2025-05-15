import React from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  className?: string;
  children: React.ReactNode;
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };