import React from "react";
import { cn } from "@/lib/utils";

type AvatarFallbackProps = {
  className?: string;
  children?: React.ReactNode;
  delayMs?: number;
};

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, children, delayMs, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      if (delayMs === undefined) {
        setIsVisible(true);
        return;
      }

      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delayMs);

      return () => clearTimeout(timer);
    }, [delayMs]);

    return isVisible ? (
      <span
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </span>
    ) : null;
  }
);

AvatarFallback.displayName = "AvatarFallback";

export { AvatarFallback };