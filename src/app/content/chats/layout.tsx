'use client'
import ConversationsBar from "@/components/global/ConversationsBar";

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