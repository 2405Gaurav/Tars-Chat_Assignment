"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  currentUserId?: string;
  onClose: () => void;
  onSelectUser?: (userId: Id<"users">) => void; // Optional callback for user selection, useful for both DM and Group creation contexts
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
      onClose(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#404EED] h-full text-white font-sans relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#5865F2] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
         <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-[#2d369e] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      {/* --- Header / Search Bar --- */}
      <div className="p-4 bg-[#23272A]/10 backdrop-blur-md border-b border-white/10 shadow-sm shrink-0 z-10">
        <div className="relative group">
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Where would you like to go?"
            className="w-full pl-4 pr-10 py-3 bg-[#23272A]/20 text-white rounded-xl placeholder:text-white/40 border border-white/10 focus:border-white/30 focus:bg-[#23272A]/30 focus:outline-none transition-all font-bold shadow-inner"
          />
          
          {/* Search/Clear Icon */}
          <div className="absolute right-3 top-3">
            {search ? (
               <button onClick={() => setSearch("")} className="text-white/60 hover:text-white transition-colors">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
            ) : (
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )}
          </div>
        </div>
      </div>

      {/* --- Results List --- */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar z-10">
        {users === undefined ? (
          // Glass Skeleton Loading
          <div className="space-y-2 mt-2 px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-white/10 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/3"></div>
                  <div className="h-2 bg-white/5 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          // Empty State - Tars Style
          <div className="flex flex-col items-center justify-center pt-16 text-center opacity-80">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-white font-black text-lg">No one&apos;s around.</p>
            <p className="text-white/60 text-sm font-medium mt-1">
              {search ? `Could not find "${search}"` : "Try searching for a username."}
            </p>
          </div>
        ) : (
          <div className="space-y-1 mt-2">
            {/* Header for results */}
            <div className="px-3 py-1 text-[10px] font-black text-white/50 uppercase tracking-widest">
                {search ? "Search Results" : "All Users"}
            </div>
            
            {users.map((u) => (
              <button
                key={u._id}
                onClick={() => handleSelectUser(u._id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all text-left group border border-transparent hover:border-white/10 hover:shadow-lg"
              >
                {/* Avatar with Next.js Image */}
                <div className="relative shrink-0">
                  {u.imageUrl ? (
                    <Image
                      src={u.imageUrl}
                      alt={u.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover bg-black/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white text-[#404EED] flex items-center justify-center font-black text-sm shadow-sm">
                      {u.name[0]?.toUpperCase()}
                    </div>
                  )}
                  {/* Status Dot */}
                  {u.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#23A559] rounded-full border-[3px] border-[#404EED] group-hover:border-[#5865F2] transition-colors"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm truncate group-hover:underline decoration-white/50 underline-offset-4">
                        {u.name}
                    </span>
                    {u.isOnline && (
                        <span className="text-[9px] bg-[#23A559]/20 text-[#23A559] border border-[#23A559]/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                            Online
                        </span>
                    )}
                  </div>
                  {/* Email/Tag */}
                  <p className="text-xs text-white/50 truncate font-medium group-hover:text-white/70">
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