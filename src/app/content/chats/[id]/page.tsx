"use client";
import ChatHeader from "@/components/chats/ChatHeader";
import ChatMessages from "@/components/chats/ChatMessages";
import Divider from "@/components/ui/Divider";

export default function Chats() {
  console.log("🛠️Parent Mounted");
  return (
    <div className="flex flex-col w-full h-[100dvh] lg:w-[40%] lg:h-[calc(100vh-16px)] bg-primaryLight-100 dark:bg-primaryLight2-700 md:rounded-lg">
      {/* Header */}
      <div className="p-2">
        <ChatHeader />
      </div>
      <Divider />
      {/* Message Content */}
      <div className="flex flex-1 min-h-0">
        <ChatMessages />
      </div>
    </div>
  );
}
