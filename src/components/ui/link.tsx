import React from "react";
import Link from "next/link";

interface LinkButtonProps {
  type: "button" | "icon" | "link";
  icon: React.ReactNode;
  label?: string;
  className?: string;
  href?: string;
  disabled?: boolean
  onClick?: () => void;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  type,
  icon,
  label,
  className,
  href,
  onClick,
  disabled
}) => {
  const baseClasses =
    "flex items-center shadow-md gap-2 p-[0.3rem] rounded-md primary-text-style primary-border-style transition-colors disabled:cursor-not-allowed disabled:opacity-70";

  if (type === "link" || type === "icon") {
    return (
      <Link href={href || "#"} className={`${baseClasses} ${className}`}>
        {icon}
        {label && <span className="text-sm">{label}</span>}
      </Link>
    );
  }

  return (
    <button className={`${baseClasses} ${className}`} onClick={onClick} disabled={disabled}>
      {icon}
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
};

export default LinkButton;
