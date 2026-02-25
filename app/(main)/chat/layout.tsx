import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/SideBar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "24rem",
          "--sidebar-width-icon": "4.5rem",
        } as React.CSSProperties//fixingg the type error for css properties
      }
      className="flex h-screen w-screen overflow-hidden bg-[#0f1014]"
    >
      <AppSidebar />

      <SidebarInset className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#0f1014]">
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}