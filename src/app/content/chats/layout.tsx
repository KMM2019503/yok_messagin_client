import ConversationsBar from "@/components/chats/ConversationsBar";
import PortableNavBar from "@/components/global/PortableNavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PortableNavBar />
      <ConversationsBar />
      {children}
    </>
  );
}
