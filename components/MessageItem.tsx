"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatMessageTime } from "../libs/utils";
import { useState } from "react";

interface MessageBubbleProps {
  data: Doc<"messages"> & {
    sender?: {
      name?: string;
      imageUrl?: string;
    };
  };
  isSender: boolean;
  reactionOptions: string[];
  viewerId?: Id<"users">;
}

export default function MessageBubble({
  data,
  isSender,
  reactionOptions,
  viewerId,
}: MessageBubbleProps) {
  const reactToMessage = useMutation(api.messages.toggleReaction);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReact = async (emoji: string) => {
    await reactToMessage({ messageId: data._id, emoji });
  };

const handleDelete = async () => {
  if (isDeleting) return;

  const confirmed = window.confirm("Delete this message?");
  if (!confirmed) return;

  try {
    setIsDeleting(true);
    await deleteMessage({ messageId: data._id });
    
  } catch {
   
  } finally {
    setIsDeleting(false);
  }
};

  const activeReactions =
    data.reactions?.filter((r) => r.userIds.length > 0) ?? [];

  return (
    <div
      className={`flex items-end gap-3 mb-4 relative group/message ${
        isSender ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar (Only for Receiver) */}
      {!isSender && (
        <div className="shrink-0 mb-1">
          {data.sender?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.sender.imageUrl}
              alt={data.sender.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white/20 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xs font-bold">
              {data.sender?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
      )}

      {/* Message Content Wrapper */}
      <div
        className={`max-w-[75%] flex flex-col ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        {/* Sender Name (Only for Receiver) */}
        {!isSender && data.sender?.name && (
          <span className="text-[10px] font-bold text-white/60 mb-1 ml-3 uppercase tracking-wider">
            {data.sender.name}
          </span>
        )}

        {/* BUBBLE CONTAINER */}
        <div className="relative group/bubble">
          
          {data.isDeleted ? (
             // --- DELETED STATE ---
            <div
              className={`px-4 py-2.5 rounded-2xl border border-white/5 ${
                isSender ? "rounded-br-sm bg-white/10" : "rounded-bl-sm bg-black/10"
              }`}
            >
              <p className="text-sm text-white/40 italic flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                This message was deleted
              </p>
            </div>
          ) : (
             // --- ACTIVE MESSAGE STATE ---
            <div
              className={`px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 ${
                isSender
                  ? "bg-white text-[#404EED] rounded-br-sm" // Sender: White Bubble, Blue Text
                  : "bg-black/20 backdrop-blur-md text-white border border-white/10 rounded-bl-sm" // Receiver: Glass Bubble
              }`}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words font-medium">
                {data.content}
              </p>
            </div>
          )}

          {/* --- HOVER ACTIONS (Reaction Picker) --- */}
          {!data.isDeleted && (
            <div
              className={`absolute -top-10 hidden group-hover/bubble:flex pb-2 z-30 transition-all ${
                isSender ? "right-0" : "left-0"
              }`}
            >
              <div className="flex items-center gap-0.5 bg-[#36393f] p-1 rounded-full shadow-xl border border-white/10">
                {reactionOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className="text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 hover:scale-110 transition-all active:scale-95"
                    title={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- DELETE BUTTON --- */}
          {!data.isDeleted && isSender && (
            <button
              onClick={handleDelete}
              className="absolute top-1/2 -translate-y-1/2 -left-10 opacity-0 group-hover/bubble:opacity-100 flex items-center justify-center w-8 h-8 bg-red-500/20 text-red-200 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"
              title="Delete message"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* --- EXISTING REACTIONS DISPLAY --- */}
        {activeReactions.length > 0 && (
          <div
            className={`flex flex-wrap gap-1.5 mt-2 ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            {activeReactions.map((r) => {
               const iAmReacting = viewerId && r.userIds.includes(viewerId);
               return (
                <button
                    key={r.emoji}
                    onClick={() => handleReact(r.emoji)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all border ${
                    iAmReacting
                        ? "bg-white text-[#404EED] border-white shadow-sm" // Active: White pill
                        : "bg-black/20 text-white/70 border-white/5 hover:bg-black/30 hover:border-white/20" // Inactive: Glass pill
                    }`}
                >
                    <span>{r.emoji}</span>
                    <span>{r.userIds.length}</span>
                </button>
               );
            })}
          </div>
        )}

        {/* --- TIMESTAMP --- */}
        <span className={`text-[10px] font-medium mt-1 opacity-60 ${isSender ? "text-white text-right" : "text-white ml-1"}`}>
          {formatMessageTime(data._creationTime)}
        </span>
      </div>
    </div>
  );
}