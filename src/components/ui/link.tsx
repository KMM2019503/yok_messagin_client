import React from "react";
import Link from "next/link";

interface LinkButtonProps {
  type?: "icon" | "text" | "icon-text";
  icon?: React.ReactNode;
  text?: string;
  className?: string;
  href?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  icon,
  text,
  className,
  href,
  type = "text",
}) => {
  return (
    <Link
      href={href || "#"}
      className={`flex items-center justify-center p-2 rounded-md bg-zinc-200 dark:bg-cyan-800 hover:bg-gray-100 dark:hover:bg-cyan-900 transition-colors ${className}`}
    >
      {type === "icon" && icon}
      {type === "text" && text}
    </Link>
  );
};

export default LinkButton;
