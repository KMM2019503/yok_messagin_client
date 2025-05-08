import SideBar from "@/components/global/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className="flex min-h-screen w-full bg-primaryLight-200 dark:bg-primaryDark-100">
          <SideBar />
          {children}
        </div>
  );
}
