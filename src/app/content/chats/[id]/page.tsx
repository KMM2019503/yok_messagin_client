import ChatHeader from "@/components/chats/ChatHeader";
import ChatMessages from "@/components/chats/ChatMessages";
import Divider from "@/components/ui/Divider";

type ChatsProps = {
  params: {
    id: string;
  };
};

export default function Chats({ params }: ChatsProps) {
  return (
    <div className="flex flex-col w-full  lg:w-[40%] h-[100dvh] lg:h-[calc(100vh-16px)] bg-primaryLight-100 dark:bg-primaryLight2-700 md:rounded-lg">
      {/* Header */}
      <div className="p-2">
        <ChatHeader />
      </div>
      <Divider />
      {/* Message Content */}
      <ChatMessages />
    </div>
  );
}
