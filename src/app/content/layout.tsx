// app/layout.tsx
"use client";
import SideBar from "@/components/global/SideBar";
import ConnectionStatus from "@/components/utils/ConnectionStatus";
import SocketConnection from "@/components/utils/SocketConnection";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row-reverse lg:flex-row min-h-screen w-full bg-primaryLight-300 dark:bg-[#210F37] relative">
      <SideBar />
      <div className="lg:px-[0.5rem] lg:py-[0.5rem] flex w-full gap-2">
        <SocketConnection />
        {process.env.NEXT_PUBLIC_ENVIRONMENT === "development" && (
          <ConnectionStatus />
        )}
        {children}
      </div>
    </div>
  );
}
