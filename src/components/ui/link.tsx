import React from "react";
import Link from "next/link";

interface LinkButtonProps {
  type: "button" | "icon" | "link";
  icon: React.ReactNode;
  label?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  type,
  icon,
  label,
  className,
  href,
  onClick,
}) => {
  const baseClasses =
    "flex items-center shadow-md gap-2 p-[0.3rem] rounded-md text-primaryLight-600 border border-primaryLight-600 hover:border-primaryLight-700 hover:text-primaryLight-800 dark:border-cyan-900 dark:text-cyan-900 dark:hover:border-cyan-800 dark:hover:text-cyan-700 transition-colors";

  if (type === "link" || type === "icon") {
    return (
      <Link href={href || "#"} className={`${baseClasses} ${className}`}>
        {icon}
        {label && <span className="text-sm">{label}</span>}
      </Link>
    );
  }

  return (
    <button className={`${baseClasses} ${className}`} onClick={onClick}>
      {icon}
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
};

export default LinkButton;
