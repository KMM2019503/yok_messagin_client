import React from "react";
import { cn } from "@/lib/utils";

type AvatarImageProps = {
  className?: string;
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
};

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, style, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        style={style}
        className={cn(
          "aspect-square h-full w-full object-cover",
          className
        )}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = "AvatarImage";

export { AvatarImage };