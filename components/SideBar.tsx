"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"; 
import UserSearch from "./UserSearch";
import CreateGroup from "./CreateGroup";
import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen, MessageSquare, Users, Plus } from "lucide-react";

export default function AppSidebar() {
  const { user } = useUser();
  const router = useRouter();
  const { toggleSidebar, open, isMobile } = useSidebar(); // ✅ Get isMobile

  const [showSearch, setShowSearch] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  const resetViews = () => {
    setShowSearch(false);
    setShowGroup(false);
  };

  // --- Common Content (Used for both Mobile Div and Desktop Sidebar) ---
  const SidebarInnerContent = (
    <>
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-purple-900/20 rounded-full mix-blend-screen filter blur-[60px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-64 h-64 bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[60px] opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      </div>

      {/* --- HEADER --- */}
      <SidebarHeader className="px-4 py-4 bg-white/[0.01] backdrop-blur-xl border-b border-white/5 z-20 h-20 justify-center">
        <div className="flex items-center justify-between w-full group/header">
          <Link href="/" className="flex items-center gap-3 cursor-pointer overflow-hidden relative">
            <div className="shrink-0 p-0.5 rounded-full border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)] group-hover/header:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" }}} />
            </div>
            {(open || isMobile) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="font-bold text-gray-100 text-sm truncate group-hover/header:text-purple-300 transition-colors tracking-wide">
                  {user?.username ?? user?.fullName}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest group-hover/header:text-purple-400/70">Online</span>
              </div>
            )}
          </Link>
          {open && !isMobile && (
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-white transition-colors hover:scale-110 transform">
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
        {!open && !isMobile && (
           <button onClick={toggleSidebar} className="text-gray-500 hover:text-white transition-colors mx-auto mt-2 hover:scale-110 transform">
             <PanelLeftOpen className="w-4 h-4" />
           </button>
        )}
      </SidebarHeader>

      {/* --- CONTENT --- */}
      <SidebarContent className="p-4 z-10 overflow-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {!showSearch && !showGroup && (
          <div className="space-y-3 mb-6">
            <MenuButton label="Direct Messages" icon={<MessageSquare className="w-4 h-4" />} onClick={() => { if (!open && !isMobile) toggleSidebar(); setShowSearch(true); setShowGroup(false); }} isOpen={open || isMobile} />
            <MenuButton label="Groups" icon={<Users className="w-4 h-4" />} onClick={() => { if (!open && !isMobile) toggleSidebar(); setShowGroup(true); setShowSearch(false); }} isOpen={open || isMobile} />
          </div>
        )}

        {(open || isMobile) ? (
            <div className="flex-1 relative h-full">
            {showSearch ? (
                <GlassCard title="Find User" onBack={resetViews}>
                    <UserSearch currentUserId={user?.id} onClose={resetViews} onSelectUser={async (userId: string) => { resetViews(); router.push(`/chat/new?userId=${userId}`); }} />
                </GlassCard>
            ) : showGroup ? (
                <GlassCard title="Create Group" onBack={resetViews}>
                    <CreateGroup currentUserId={user?.id} onClose={resetViews} />
                </GlassCard>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-[#1a1b23]/40 border border-white/5 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(88,28,135,0.15)] backdrop-blur-sm transform rotate-3 hover:rotate-6 transition-transform duration-500">
                         <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Plus className="w-6 h-6 text-white" />
                         </div>
                    </div>
                    <div className="px-4">
                        <p className="text-xs font-bold text-gray-300 mb-2 tracking-widest uppercase">Start Chatting</p>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-[15rem] mx-auto">Select a category above to find friends or create a new squad.</p>
                    </div>
                </div>
            )}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-30">
                 <div className="w-1 h-12 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent rounded-full"></div>
            </div>
        )}
      </SidebarContent>

      {/* --- FOOTER --- */}
      <SidebarFooter className="bg-white/[0.01] backdrop-blur-md p-4 border-t border-white/5 z-20">
        <div className={`flex items-center ${(open || isMobile) ? "justify-between" : "justify-center"} text-[10px] font-bold tracking-widest text-gray-500`}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {(open || isMobile) && <span className="text-gray-400">VOICE: OK</span>}
          </div>
          {(open || isMobile) && <span className="opacity-30">V 1.0</span>}
        </div>
      </SidebarFooter>
      
      {!isMobile && <SidebarRail className="hover:bg-purple-500/30 hover:w-[4px] transition-all duration-300" />}
    </>
  );

  // ✅ LOGIC: If Mobile, render a plain DIV (bypassing Sheet logic). If Desktop, render Sidebar component.
  if (isMobile) {
    return (
      <div 
        className="flex flex-col h-full w-full bg-[#0f1014] text-gray-100 font-sans border-r border-white/5 relative"
        style={{ backgroundColor: "#0f1014" }}
      >
        {SidebarInnerContent}
      </div>
    );
  }

  return (
    <Sidebar
      collapsible="icon"
      className="h-full border-none text-gray-100 font-sans !bg-[#0f1014]"
      style={{
        "--sidebar": "#0f1014",
        "--sidebar-foreground": "#f3f4f6",
        "--sidebar-border": "rgba(255,255,255,0.05)",
        "--sidebar-accent": "rgba(255,255,255,0.05)",
        "--sidebar-accent-foreground": "#f3f4f6",
        backgroundColor: "#0f1014",
      } as React.CSSProperties}
    >
      {SidebarInnerContent}
    </Sidebar>
  );
}

// --- SUB-COMPONENTS (Keep these unchanged) ---
function MenuButton({ label, icon, onClick, isOpen }: { label: string; icon: React.ReactNode; onClick: () => void; isOpen: boolean }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isOpen ? "justify-start bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30" : "justify-center hover:bg-white/10"}`}>
            <div className={`${isOpen ? "text-purple-400" : "text-gray-400"} group-hover:text-purple-300 transition-colors`}>{icon}</div>
            {isOpen && (
                <>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </>
            )}
        </button>
    );
}

function GlassCard({ children, title, onBack }: { children: React.ReactNode; title: string; onBack: () => void }) {
    return (
        <div className="bg-[#1a1b23]/40 backdrop-blur-xl rounded-2xl p-1 h-full flex flex-col border border-white/5 shadow-2xl overflow-hidden animate-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 shrink-0 bg-white/[0.02]">
                <h3 className="text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2"><span className="w-1 h-3 bg-purple-500 rounded-full"></span>{title}</h3>
                <button onClick={onBack} className="text-gray-500 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="flex-1 overflow-hidden relative p-1">{children}</div>
        </div>
    );
}