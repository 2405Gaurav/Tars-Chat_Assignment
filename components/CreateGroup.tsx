"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Search, Check, Hash, Loader2 } from "lucide-react";

interface Props {
  currentUserId?: string;
  onClose: () => void;
}

export default function CreateGroup({ onClose }: Props) {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<Id<"users">[]>([]);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  // Fetch users based on search query
  const users = useQuery(api.users.listAllUsers, { search: search || undefined });
  const createGroup = useMutation(api.users_conversations.createGroup);

  const toggleUser = (id: Id<"users">) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selected.length < 1) return;
    setIsCreating(true);
    try {
      const convId = await createGroup({ memberIds: selected, groupName: groupName.trim() });
      router.push(`/chat/${convId}`);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1014] h-full text-gray-100 font-sans relative selection:bg-purple-500/30 selection:text-white">
      
      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-purple-900/20 rounded-full mix-blend-screen filter blur-[60px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[60px] opacity-30"></div>
         {/* Grid Texture */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      </div>

      {/* --- Inputs Section --- */}
      <div className="p-4 space-y-5 shrink-0 z-10">
        
        {/* Group Name Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
            Group Name
          </label>
          <div className="relative group">
            <input
                autoFocus
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="ex. The Avengers"
                className="w-full pl-4 pr-10 py-3 bg-[#1a1b23]/60 backdrop-blur-md text-gray-100 rounded-xl placeholder:text-gray-600 border border-white/10 focus:border-purple-500/50 focus:bg-[#1a1b23] focus:outline-none transition-all font-bold shadow-lg"
            />
            <Hash className="absolute right-3 top-3.5 w-4 h-4 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
          </div>
        </div>

        {/* User Search Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
            Add Members ({selected.length})
          </label>
          <div className="relative group">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1b23]/40 text-gray-200 rounded-xl placeholder:text-gray-600 border border-white/5 focus:border-purple-500/30 focus:bg-[#1a1b23]/60 focus:outline-none transition-all font-medium text-sm"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* --- User List --- */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 custom-scrollbar z-10 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {users === undefined ? (
           // Loading Skeletons
           <div className="space-y-3 mt-2">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse border border-white/5" />
             ))}
           </div>
        ) : users.length === 0 ? (
           <div className="text-center py-10 bg-white/[0.02] rounded-xl border border-white/5 mt-2 dashed border-dashed">
             <p className="text-gray-500 font-bold text-xs uppercase tracking-wider">No users found</p>
           </div>
        ) : (
          <div className="grid gap-2">
            {users.map((u) => {
              const isSelected = selected.includes(u._id);
              return (
                <button
                  key={u._id}
                  onClick={() => toggleUser(u._id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group border relative overflow-hidden
                    ${isSelected 
                        ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.15)] translate-x-1" 
                        : "bg-[#1a1b23]/20 border-transparent hover:bg-white/5 hover:border-white/10"
                    }
                  `}
                >
                  {/* Selection Glow Indicator */}
                  {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
                  )}

                  {/* Avatar Area */}
                  <div className="relative shrink-0 ml-1">
                    {u.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={u.imageUrl} 
                        alt={u.name} 
                        className={`w-10 h-10 rounded-lg object-cover transition-all ${isSelected ? 'ring-2 ring-purple-500/50' : 'opacity-80 group-hover:opacity-100'}`} 
                      />
                    ) : (
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black transition-all
                        ${isSelected ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}
                      `}>
                        {u.name[0]?.toUpperCase()}
                      </div>
                    )}
                    
                    {/* Status Dot */}
                    {u.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f1014]"></div>
                    )}
                  </div>

                  {/* Name Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {u.name}
                    </p>
                    <p className={`text-[10px] font-medium truncate ${isSelected ? 'text-purple-300' : 'text-gray-600 group-hover:text-gray-500'}`}>
                      @{u.name.toLowerCase().replace(/\s/g, '')}
                    </p>
                  </div>

                  {/* Checkbox UI */}
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-all duration-300
                    ${isSelected 
                      ? "bg-purple-500 border-purple-500 shadow-[0_0_10px_#a855f7]" 
                      : "border-white/20 bg-transparent group-hover:border-white/50"
                    }
                  `}>
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Footer Action --- */}
      <div className="p-4 mt-2 z-20 shrink-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014] to-transparent">
        <button
          onClick={handleCreate}
          disabled={!groupName.trim() || selected.length < 1 || isCreating}
          className={`
            w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
            ${!groupName.trim() || selected.length < 1 || isCreating
              ? "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-white/10"
            }
          `}
        >
          {isCreating ? (
            <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
            </>
          ) : (
            <>
                Create Group
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{selected.length}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}