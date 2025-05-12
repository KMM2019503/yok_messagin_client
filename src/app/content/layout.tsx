import ConversationsBar from "@/components/global/ConversationsBar";
import SideBar from "@/components/global/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-primaryLight-300 dark:bg-[#210F37]">
      <SideBar />
      <div className="lg:px-[0.45rem] lg:py-[0.5rem] flex w-full gap-2">
        {/* Conversations Bar */}
        <ConversationsBar />
        {children}
      </div>
    </div>
  );
}
