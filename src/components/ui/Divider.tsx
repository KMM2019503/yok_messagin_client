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
  color = "border-primaryLight-600 dark:border-primaryLight2-500",
}) => {
  const baseStyles =
    orientation === "horizontal"
      ? `w-full border-t-[0.5px]`
      : `h-full border-l-[0.5px]`;

  return (
    <div
      className={`${baseStyles} ${color} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

export default Divider;
