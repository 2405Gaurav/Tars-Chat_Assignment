"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import UserSearch from "./UserSearch";
import CreateGroup from "./CreateGroup";
import Link from "next/link";

export default function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // State for toggling views
  const [showSearch, setShowSearch] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  const activeConvId = pathname.startsWith("/chat/")
    ? pathname.split("/chat/")[1]
    : null;

  const isOnMobileChatPage = activeConvId && pathname !== "/chat";

  // Helper to reset views
  const resetViews = () => {
    setShowSearch(false);
    setShowGroup(false);
  };

  return (
    <aside
      className={`
        w-full md:w-80 lg:w-96 flex flex-col h-full font-sans relative overflow-hidden transition-all duration-300
        bg-[#0f1014] text-gray-100 border-r border-white/5
        ${isOnMobileChatPage ? "hidden md:flex" : "flex"}
      `}
    >
      {/* --- Dark Purple Ambience --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Deep Purple Glow Top-Left */}
        <div className="absolute top-[-10%] left-[-20%] w-80 h-80 bg-purple-900/30 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse"></div>
        {/* Indigo Glow Bottom-Right */}
        <div className="absolute bottom-[-10%] right-[-20%] w-80 h-80 bg-indigo-900/20 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>
      </div>

      {/* --- Header: User Profile (Glass) --- */}
      <div className="px-4 py-2 bg-white/3 backdrop-blur-xl border-b border-white/5 z-20 shrink-0 h-14 flex items-center shadow-lg">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer w-full">
          <div className="p-0.5 rounded-full border border-purple-500/30 group-hover:border-purple-400 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.15)]">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: { userButtonAvatarBox: "w-7 h-7" },
              }}
            />
          </div>

          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-semibold text-gray-100 text-sm truncate group-hover:text-purple-300 transition-colors">
              {user?.username ?? user?.fullName}
            </span>
            <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider group-hover:text-gray-400">
              #{user?.id?.slice(-4) ?? "0000"}
            </span>
          </div>
        </Link>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col p-4 z-10 overflow-hidden">

        {/* Navigation Headers */}
        {!showSearch && !showGroup && (
          <div className="space-y-6 mt-2 mb-4">

            {/* Direct Messages Header */}
            <div
              className="flex items-center justify-between group cursor-pointer px-3 py-1 hover:bg-white/5 rounded-lg transition-all"
              onClick={() => { setShowSearch(true); setShowGroup(false); }}
            >
              <span className="text-xs font-bold text-purple-300/80 uppercase tracking-widest group-hover:text-purple-300 transition-colors shadow-black drop-shadow-sm">
                Direct Messages
              </span>
              <button className="text-gray-500 group-hover:text-white transition-all transform group-hover:scale-110">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Groups Header */}
            <div
              className="flex items-center justify-between group cursor-pointer px-3 py-1 hover:bg-white/5 rounded-lg transition-all"
              onClick={() => { setShowGroup(true); setShowSearch(false); }}
            >
              <span className="text-xs font-bold text-purple-300/80 uppercase tracking-widest group-hover:text-purple-300 transition-colors shadow-black drop-shadow-sm">
                Groups
              </span>
              <button className="text-gray-500 group-hover:text-white transition-all transform group-hover:scale-110">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Content Switching (Glass Card Container) */}
        <div className="flex-1 relative">

          {/* 1. SEARCH USER VIEW */}
          {showSearch ? (
            <div className="bg-[#1a1b23]/80 backdrop-blur-2xl rounded-2xl p-1 h-full flex flex-col border border-white/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 shrink-0 bg-white/[0.02]">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Find User</h3>
                <button onClick={resetViews} className="text-gray-500 hover:text-white hover:bg-white/10 rounded p-1 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <UserSearch
                  currentUserId={user?.id}
                  onClose={resetViews}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSelectUser={async (userId: any) => {
                    resetViews();
                    router.push(`/chat/new?userId=${userId}`);
                  }}
                />
              </div>
            </div>
          ) : showGroup ? (
            /* 2. CREATE GROUP VIEW */
            <div className="bg-[#1a1b23]/80 backdrop-blur-2xl rounded-2xl p-1 h-full flex flex-col border border-white/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 shrink-0 bg-white/[0.02]">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Create Group</h3>
                <button onClick={resetViews} className="text-gray-500 hover:text-white hover:bg-white/10 rounded p-1 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <CreateGroup
                  currentUserId={user?.id}
                  onClose={resetViews}
                />
              </div>
            </div>
          ) : (
            /* 3. EMPTY STATE (Default) */
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <div className="w-24 h-24 bg-linear-to-tr from-purple-900/20 to-indigo-900/20 rounded-full flex items-center justify-center border border-white/5 shadow-[0_0_30px_rgba(88,28,135,0.2)]">
                <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="px-6">
                <p className="text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                  Nothing Selected
                </p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Select a conversation or use the <span className="text-purple-400 font-bold text-sm">+</span> to start something new.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* footerrr  */}
      <div className="bg-black/20 backdrop-blur-md p-3 flex justify-between items-center text-[10px] font-bold text-gray-500 px-6 border-t border-white/5 z-20 shrink-0">
        <div className="flex items-center gap-2 group cursor-help">
          <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:shadow-[0_0_8px_#10b981] transition-shadow"></div>
          <span className="group-hover:text-gray-300 transition-colors">Voice Connected</span>
        </div>
        <span className="font-mono opacity-50">RTC: OK</span>
      </div>
    </aside>
  );
}