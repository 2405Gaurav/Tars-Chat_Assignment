"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import UserSearch from "./UserSearch";
import CreateGroup from "./CreateGroup"; // Imported

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
        w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-950 flex flex-col h-full text-gray-100
        ${isOnMobileChatPage ? "hidden md:flex" : "flex"}
      `}
    >
      {/* Header: User Profile */}
      <div className="px-4 py-3 bg-slate-900 shadow-sm border-b border-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 rounded-full p-0.5">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-200 text-sm tracking-tight">
              {user?.username ?? user?.fullName}
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              #{user?.id?.slice(-4) ?? "0000"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-2">
        
        {/* Navigation / Category Headers (Only show if not in a modal mode) */}
        {!showSearch && !showGroup && (
          <div className="space-y-4 px-2 mt-2">
            
            {/* Direct Messages Header */}
            <div 
              className="flex items-center justify-between text-gray-400 hover:text-gray-200 transition-colors cursor-pointer group" 
              onClick={() => { setShowSearch(true); setShowGroup(false); }}
            >
                <span className="text-xs font-bold uppercase tracking-wide">Direct Messages</span>
                <button className="text-gray-400 hover:text-white transition-transform duration-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Groups Header */}
            <div 
              className="flex items-center justify-between text-gray-400 hover:text-gray-200 transition-colors cursor-pointer group"
              onClick={() => { setShowGroup(true); setShowSearch(false); }}
            >
                <span className="text-xs font-bold uppercase tracking-wide">Groups</span>
                <button className="text-gray-400 hover:text-white transition-transform duration-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
          </div>
        )}

        {/* Dynamic Content Switching */}
        <div className="flex-1 mt-2">
            
            {/* 1. SEARCH USER VIEW */}
            {showSearch ? (
            <div className="bg-slate-800/50 rounded-md p-2 h-full flex flex-col border border-slate-800">
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Find User</h3>
                    <button onClick={resetViews} className="text-gray-500 hover:text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <UserSearch
                currentUserId={user?.id}
                onClose={resetViews}
                onSelectUser={async (userId: Id<"users">) => {
                    resetViews();
                    router.push(`/chat/new?userId=${userId}`);
                }}
                />
            </div>
            ) : showGroup ? (
            /* 2. CREATE GROUP VIEW */
            <div className="bg-slate-800/50 rounded-md p-2 h-full flex flex-col border border-slate-800">
                 <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Create Group</h3>
                    <button onClick={resetViews} className="text-gray-500 hover:text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* Render the CreateGroup component passed from props/imports */}
                <CreateGroup
                    currentUserId={user?.id}
                    onClose={resetViews}
                />
            </div>
            ) : (
            /* 3. EMPTY STATE (Default) */
            <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center opacity-50">
                    <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className="text-center px-4">
                    <p className="text-sm font-medium text-slate-500">No conversations selected.</p>
                    <p className="text-xs text-slate-600 mt-2">
                        Use the <span className="text-indigo-400 font-bold">+</span> buttons above to start a chat or create a group.
                    </p>
                </div>
            </div>
            )}
        </div>
      </div>

      {/* Footer: Status */}
      <div className="bg-slate-950/80 p-2 flex justify-between items-center text-[11px] text-slate-500 px-4 border-t border-slate-900">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Voice Connected</span>
         </div>
         <span className="text-[10px] font-mono">RTC: Connected</span>
      </div>
    </aside>
  );
}