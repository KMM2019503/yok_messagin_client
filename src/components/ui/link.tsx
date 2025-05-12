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
    "flex items-center shadow-md gap-2 p-[0.3rem] rounded-md primary-text-style primary-border-style transition-colors";

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
