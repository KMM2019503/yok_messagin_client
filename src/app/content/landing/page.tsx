import PortableNavBar from "@/components/global/PortableNavBar";
import ThemeSwitcher from "@/components/ThemeSwitch";
import React from "react";

const Landing = () => {
  return (
    <div className="w-full h-[calc(100vh - 1rem)] relative">
      <PortableNavBar />
    </div>
  );
};

export default Landing;
