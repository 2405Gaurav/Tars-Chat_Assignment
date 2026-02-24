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

  const users = useQuery(api.users.listAllUsers, { search: search || undefined });
  const createGroup = useMutation(api.users_conversations.createGroup);

  const toggleUser = (id: Id<"users">) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selected.length < 1) return;
    try {
    //   {*@ts-expect-error - Assuming API accepts memberIds and groupName*}
      const convId = await createGroup({ memberIds: selected, groupName: groupName.trim() });
      router.push(`/chat/${convId}`);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 h-full text-gray-200">
      
      {/* Input Section (Name & Search) */}
      <div className="p-3 space-y-3 shrink-0 border-b border-slate-950/50">
        
        {/* Group Name Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Group Name
          </label>
          <input
            autoFocus
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="New Server..."
            className="w-full px-3 py-2 bg-slate-950 text-gray-100 rounded text-sm placeholder:text-slate-600 border border-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>

        {/* User Search Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Select Friends ({selected.length})
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username"
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 text-gray-200 rounded text-sm placeholder:text-slate-600 border border-slate-800 focus:border-indigo-500 focus:outline-none"
            />
            <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {users === undefined ? (
           // Dark Skeleton
           <div className="space-y-2">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
             ))}
           </div>
        ) : users.length === 0 ? (
           <div className="text-center py-6 text-slate-500 text-xs">
             No friends found.
           </div>
        ) : (
          <div className="space-y-0.5">
            {users.map((u) => {
              const isSelected = selected.includes(u._id);
              return (
                <button
                  key={u._id}
                  onClick={() => toggleUser(u._id)}
                  className={`
                    w-full flex items-center gap-3 p-2 rounded transition-all text-left group
                    ${isSelected ? "bg-indigo-500/10" : "hover:bg-slate-800"}
                  `}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {u.imageUrl ? (
                      <img src={u.imageUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover bg-slate-800" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                        {u.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isSelected ? "text-indigo-200" : "text-gray-300"}`}>
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {u.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>

                  {/* Custom Checkbox UI */}
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-all
                    ${isSelected 
                      ? "bg-indigo-500 border-indigo-500" 
                      : "border-slate-600 group-hover:border-slate-400 bg-transparent"
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-3 border-t border-slate-950 bg-slate-900">
        <button
          onClick={handleCreate}
          disabled={!groupName.trim() || selected.length < 1}
          className={`
            w-full py-2 rounded text-sm font-bold uppercase tracking-wide transition-all shadow-sm
            ${!groupName.trim() || selected.length < 1
              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-400"
            }
          `}
        >
          Create Channel
        </button>
      </div>
    </div>
  );
}