"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Search, X, User, MessageSquare } from "lucide-react";

interface Props {
  currentUserId?: string;
  onClose: () => void;
  onSelectUser?: (userId: Id<"users">) => void;
}

export default function UserSearch({ onClose }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const getOrCreateDM = useMutation(api.users_conversations.getOrCreateDM);

  const users = useQuery(api.users.listAllUsers, { search: search || undefined });
  //here now i have the hasread prop and will use it to get the notification 

  const handleSelectUser = async (userId: Id<"users">) => {
    try {
      const convId = await getOrCreateDM({ otherUserId: userId });
      router.push(`/chat/${convId}`);
      onClose(); 
    } catch (err) {
      console.error(err);
    }
  };

  console.log(users);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1014] h-full text-gray-100 font-sans relative selection:bg-purple-500/30 selection:text-white">
      
      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-purple-900/20 rounded-full mix-blend-screen filter blur-[60px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[60px] opacity-30"></div>
         {/* Grid Texture */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      </div>

      {/* --- Header / Search Bar --- */}
      <div className="p-4 bg-white/[0.01] backdrop-blur-xl border-b border-white/5 shrink-0 z-10">
        <div className="relative group">
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username..."
            className="w-full pl-10 pr-10 py-3 bg-[#1a1b23]/40 text-gray-100 rounded-xl placeholder:text-gray-500 border border-white/5 focus:border-purple-500/50 focus:bg-[#1a1b23]/80 focus:outline-none transition-all font-bold shadow-lg text-sm"
          />
          
          {/* Search Icon */}
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />

          {/* Clear Icon */}
          {search && (
               <button onClick={() => setSearch("")} className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-md p-0.5">
                 <X className="w-4 h-4" />
               </button>
          )}
        </div>
      </div>

      {/* --- Results List --- */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {users === undefined ? (
          // Glass Skeleton Loading
          <div className="space-y-2 mt-2 px-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse bg-white/5 border border-white/5">
                <div className="w-10 h-10 bg-white/10 rounded-lg shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/3"></div>
                  <div className="h-2 bg-white/5 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center pt-16 text-center opacity-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#1a1b23]/40 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/5 shadow-[0_0_30px_rgba(88,28,135,0.15)] transform rotate-3">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-300 font-bold text-sm tracking-widest uppercase">No users found</p>
            <p className="text-gray-600 text-[11px] font-medium mt-1 max-w-[150px]">
              {search ? `We couldn't find "${search}"` : "Try searching for a friend to chat with."}
            </p>
          </div>
        ) : (
          <div className="space-y-1 mt-2">
            {/* Header for results */}
            <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                {search ? "Search Results" : "All Users"}
            </div>
            
            {users.map((u) => (
              <button
                key={u._id}
                onClick={() => handleSelectUser(u._id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-[#1a1b23]/60 hover:backdrop-blur-md rounded-xl transition-all text-left group border border-transparent hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(147,51,234,0.1)] relative overflow-hidden"
              >
                
                {/* Avatar */}
                <div className="relative shrink-0">
                  {u.imageUrl ? (
                    <Image
                      src={u.imageUrl}
                      alt={u.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover bg-black/20 group-hover:ring-2 ring-purple-500/30 transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-lg">
                      {u.name[0]?.toUpperCase()}
                    </div>
                  )}

                  {/* 🔴 Unread Notification (Top Right) */}
                  {u.hasUnread && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f1014] shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                  )}

                  {/* Status Dot */}
                  {u.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-[#0f1014]"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-200 text-sm truncate group-hover:text-purple-300 transition-colors">
                        {u.name}
                    </span>
                    {u.isOnline && (
                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                            Online
                        </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate font-medium group-hover:text-gray-400 transition-colors">
                    @{u.email?.split('@')[0] || "user"}
                  </p>
                </div>

                {/* Hover Arrow Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}