"use client";

interface Props {
  users: Array<{ _id: string; name: string; imageUrl?: string }>;
}

export default function TypingIndicator({ users }: Props) {
  if (users.length === 0) return null;

  // Functionality preserved exactly as requested
  const names =
    users.length === 1
      ? users[0].name.split(" ")[0]
      : users.length === 2
      ? `${users[0].name.split(" ")[0]} and ${users[1].name.split(" ")[0]}`
      : `${users[0].name.split(" ")[0]} and ${users.length - 1} others`;

  return (
    <div className="flex items-center gap-3 mb-4 px-2">
      {/* Avatar Section */}
      {users[0]?.imageUrl ? (
        <img
          src={users[0].imageUrl}
          alt={users[0].name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-slate-800"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {users[0]?.name?.[0]?.toUpperCase()}
        </div>
      )}

      {/* Typing Bubble & Text */}
      <div className="flex flex-col">
         {/* The Bubble */}
        <div className="bg-slate-800 rounded-lg rounded-tl-none px-3 py-2 self-start w-fit">
          <div className="flex gap-1 items-center h-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
          </div>
        </div>
        
        {/* The Text Label */}
        <span className="text-[10px] uppercase font-bold text-slate-500 mt-1 ml-1 tracking-wide">
          {names} {users.length === 1 ? "is" : "are"} 💬typing...
        </span>
      </div>
    </div>
  );
}