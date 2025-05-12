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
      className={`py-2 px-1 rounded-md primary-text-style primary-border-style transition-colors  ${className}
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
