import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Trand Yok",
  description: "Dev Testing Messaging App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen max-h-screen justify-center items-center bg-[#a2d2ff] dark:bg-[#1d2d44] font-mono">
      {children}
    </div>
  );
}
