"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import UserSearch from "./UserSearch"; 

export default function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

  // Checks if we are on a specific chat page for mobile responsiveness
  const activeConvId = pathname.startsWith("/chat/")
    ? pathname.split("/chat/")[1]
    : null;

  const isOnMobileChatPage = activeConvId && pathname !== "/chat";

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
          {/* Clerk User Button with a dark wrapper */}
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
        
        {/* 'Direct Messages' Label & Add Button */}
        {!showSearch && (
            <div 
              className="mb-2 px-2 flex items-center justify-between text-gray-400 hover:text-gray-200 transition-colors cursor-pointer group" 
              onClick={() => setShowSearch(true)}
            >
                <span className="text-xs font-semibold uppercase tracking-wide">Direct Messages</span>
                <button 
                    className="text-gray-400 hover:text-white group-hover:rotate-90 transition-transform duration-200"
                    title="Add User"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        )}

        {/* Content Switcher: Search Mode OR Empty State */}
        {showSearch ? (
          <div className="bg-slate-800/50 rounded-md p-2 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Find User</h3>
                <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {/* The UserSearch component handles the input and list of users */}
            <UserSearch
              currentUserId={user?.id}
              onClose={() => setShowSearch(false)}
              onSelectUser={async (userId: Id<"users">) => {
                setShowSearch(false);
                router.push(`/chat/new?userId=${userId}`);
              }}
            />
          </div>
        ) : (
          /* Empty State (Since conversations list is removed) */
          <div className="flex flex-col items-center justify-center flex-1 text-slate-600 space-y-4">
             <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center opacity-50">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </div>
             <div className="text-center">
                 <p className="text-sm font-medium text-slate-500">No one is here yet.</p>
                 <button 
                    onClick={() => setShowSearch(true)}
                    className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded shadow-sm transition-all"
                 >
                    Add a Friend
                 </button>
             </div>
          </div>
        )}
      </div>

      {/* Footer: User Status (Decorative) */}
      <div className="bg-slate-950/80 p-2 flex justify-between items-center text-[11px] text-slate-500 px-4 border-t border-slate-900">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Ready to chat</span>
         </div>
      </div>
    </aside>
  );
}