import React from "react";
import Link from "next/link";

interface SidebarLinkButton {
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  href?: string;
  isExpanded?: boolean;
}

const SidebarLinkButton: React.FC<SidebarLinkButton> = ({
  icon,
  label,
  className,
  href,
  isExpanded = false,
}) => {
  return (
    <Link
      href={href || "#"}
      className={`py-2 px-1 rounded-md text-primaryLight-600 border border-primaryLight-600 hover:border-primaryLight-700 hover:text-primaryLight-800 dark:border-cyan-900 dark:text-cyan-900 dark:hover:border-cyan-800 dark:hover:text-cyan-700 transition-colors  ${className}
      ${
        isExpanded
          ? "grid grid-cols-2 justify-start items-center px-[1rem]"
          : "flex items-center justify-center px-[2px]"
      } 
      }`}
    >
      {icon}
      <span
        className={`text-xs transition-all duration-1000 text-right ${
          isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

export default SidebarLinkButton;
