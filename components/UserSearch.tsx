"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  currentUserId?: string;
  onClose: () => void;
  onSelectUser: (userId: Id<"users">) => void;
}

export default function UserSearch({ onClose }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const getOrCreateDM = useMutation(api.users_conversations.getOrCreateDM);

  const users = useQuery(api.users.listAllUsers, { search: search || undefined });

  const handleSelectUser = async (userId: Id<"users">) => {
    try {
      const convId = await getOrCreateDM({ otherUserId: userId });
      router.push(`/chat/${convId}`);
      onClose(); // Close the search modal/view
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 h-full">
      {/* Header / Search Bar */}
      <div className="flex items-center gap-2 px-3 py-3 bg-slate-900 border-b border-slate-950 shadow-sm shrink-0">
        <div className="flex-1 relative group">
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Where would you like to go?"
            className="w-full pl-2 pr-8 py-1.5 bg-slate-950 text-gray-200 rounded text-sm placeholder:text-slate-500 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
          />
          {/* Search Icon (Right side like Discord) */}
          <div className="absolute right-2 top-2">
            {search ? (
               <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
            ) : (
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )}
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {users === undefined ? (
          // Dark Skeleton Loading
          <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded animate-pulse">
                <div className="w-9 h-9 bg-slate-800 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-2 bg-slate-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          // Empty State - Discord Style
          <div className="flex flex-col items-center justify-center pt-10 text-center opacity-75">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 grayscale">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-gray-400 font-semibold text-sm">No one&lsquo;s around.</p>
            <p className="text-slate-600 text-xs mt-1">
              {search ? `Wumpus couldn't find "${search}"` : "Try searching for a username."}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {/* Header for results */}
            <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                {search ? "Search Results" : "All Users"}
            </div>
            
            {users.map((u) => (
              <button
                key={u._id}
                onClick={() => handleSelectUser(u._id)}
                className="w-full flex items-center gap-3 p-2 hover:bg-slate-800 rounded-md transition-colors text-left group"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {u.imageUrl ? (
                    <img
                      src={u.imageUrl}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover bg-slate-800"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {u.name[0]?.toUpperCase()}
                    </div>
                  )}
                  {/* Status Dot (Border matches bg) */}
                  {u.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 group-hover:border-slate-800 transition-colors"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-200 text-sm truncate group-hover:text-white">
                        {u.name}
                    </span>
                    {u.isOnline && (
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-wide">
                            Online
                        </span>
                    )}
                  </div>
                  {/* Email/Tag as secondary text */}
                  <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">
                    {u.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}