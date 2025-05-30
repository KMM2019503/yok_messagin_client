'use client'

import ConversationsBar from "@/components/chats/ConversationsBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <ConversationsBar />
        { children }
      </>
  );
}