"use client";

import React from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, className }) => {
  return (
    <button
      className={`cursor-pointer inline-flex items-center justify-center p-2 rounded-full bg-zinc-200 dark:bg-cyan-800 hover:bg-gray-100 dark:hover:bg-cyan-900 transition-colors ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
