"use client";

import Sidebar from "@/components/SideBar";
import { useSyncUser } from "@/hooks/useSyncUser";
import { usePresence } from "@/hooks/usePresence";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useSyncUser();
  usePresence();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}