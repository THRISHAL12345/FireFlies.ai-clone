import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-full bg-white relative">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-r from-[#D6EAF8] via-[#FADBD8] to-[#FCF3CF] opacity-60 pointer-events-none z-0 mask-image-gradient"></div>
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-transparent to-white pointer-events-none z-0"></div>

      <Sidebar />
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden z-10">
        <Topbar />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
