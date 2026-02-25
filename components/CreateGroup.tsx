"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  currentUserId?: string;
  onClose: () => void;
}

export default function CreateGroup({ onClose }: Props) {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<Id<"users">[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Fetch users based on search query (or fetch all if search is empty)
  const users = useQuery(api.users.listAllUsers, { search: search || undefined });
  //create group from the convec apii
  const createGroup = useMutation(api.users_conversations.createGroup);

  const toggleUser = (id: Id<"users">) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selected.length < 1) return;
    try {
      const convId = await createGroup({ memberIds: selected, groupName: groupName.trim() });
      router.push(`/chat/${convId}`);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    
    <div className="flex-1 flex flex-col overflow-hidden bg-[#404EED] h-full text-white font-sans relative">
      

      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#5865F2] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
         <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-[#2d369e] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

     
      <div className="p-6 space-y-6 shrink-0 z-10">
        
      
      

    
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/70 uppercase tracking-widest pl-1">
            Group Name
          </label>
          <div className="relative">
            <input
                autoFocus
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="ex. The Avengers"
                className="w-full px-4 py-3 bg-[#23272A]/20 backdrop-blur-md text-white rounded-xl placeholder:text-white/30 border border-white/10 focus:border-white/40 focus:bg-[#23272A]/30 focus:outline-none transition-all font-bold shadow-sm"
            />
            <span className="absolute right-4 top-3.5 text-white/20 font-black">#</span>
          </div>
        </div>

   
        <div className="space-y-2">
          <label className="text-xs font-bold text-white/70 uppercase tracking-widest pl-1">
            Select Friends ({selected.length})
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#23272A]/10 text-white rounded-xl placeholder:text-white/40 border border-white/10 focus:border-white/30 focus:outline-none transition-all font-medium"
            />
            <svg className="absolute left-3.5 top-3 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

    
      <div className="flex-1 overflow-y-auto px-6 pb-2 custom-scrollbar z-10 space-y-2">
        {users === undefined ? (
           // Glass Skeleton
           <div className="space-y-3">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-14 bg-white/10 rounded-xl animate-pulse" />
             ))}
           </div>
        ) : users.length === 0 ? (
           <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5">
             <p className="text-white/40 font-bold text-sm">No friends found.</p>
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
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group border
                    ${isSelected 
                        ? "bg-white text-[#404EED] border-white shadow-lg transform scale-[1.01]" 
                        : "bg-[#23272A]/10 border-transparent hover:bg-[#23272A]/20 hover:border-white/10 text-white"
                    }
                  `}
                >
                  
                  <div className="relative shrink-0">
                    {u.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.imageUrl} alt={u.name} className="w-10 h-10 rounded-full object-cover bg-black/20" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${isSelected ? 'bg-[#404EED]/10 text-[#404EED]' : 'bg-white/20 text-white'}`}>
                        {u.name[0]?.toUpperCase()}
                      </div>
                    )}
                    {/* Online Dot */}
                    {u.isOnline && (
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-[#23A559] border-white' : 'bg-[#23A559] border-[#404EED]'}`}></div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {u.name}
                    </p>
                    <p className={`text-[10px] font-medium truncate ${isSelected ? 'opacity-70' : 'text-white/50'}`}>
                      @{u.name.toLowerCase().replace(/\s/g, '')}
                    </p>
                  </div>

                  {/* Custom Checkbox UI */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected 
                      ? "bg-[#404EED] border-[#404EED]" 
                      : "border-white/30 group-hover:border-white bg-transparent"
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fooooterr section */}
      <div className="p-6 mt-2 z-20 shrink-0 bg-linear-to-t from-[#404EED] to-transparent">
        <button
          onClick={handleCreate}
          disabled={!groupName.trim() || selected.length < 1}
          className={`
            w-full py-4 rounded-full text-lg font-black uppercase tracking-wider transition-all shadow-xl
            ${!groupName.trim() || selected.length < 1
              ? "bg-[#23272A]/20 text-white/20 border border-white/5 cursor-not-allowed"
              : "bg-white text-[#404EED] hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
            }
          `}
        >
          Create Group
        </button>
      </div>
    </div>
  );
}