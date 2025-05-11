import React from "react";

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  color?: string;
}

const Divider: React.FC<DividerProps> = ({
  className = "",
  orientation = "horizontal",
  thickness = 1,
  color = "border-primaryLight-600 dark:border-cyan-950",
}) => {
  const baseStyles =
    orientation === "horizontal"
      ? `w-full border-t-[1px]`
      : `h-full border-l-[1px]`;

  return (
    <div
      className={`${baseStyles} ${color} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

export default Divider;
