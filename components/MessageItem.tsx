"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatMessageTime } from "../libs/utils";

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

  const handleReact = async (emoji: string) => {
    await reactToMessage({ messageId: data._id, emoji });
  };

  const handleDelete = async () => {
    if (confirm("Delete this message?")) {
      await deleteMessage({ messageId: data._id }); // FIXED: changed message._id to data._id
    }
  };

  const activeReactions =
    data.reactions?.filter((r) => r.userIds.length > 0) ?? [];

  return (
    <div
      className={`flex items-end gap-3 mb-2 relative ${
        isSender ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isSender && (
        <div className="flex-shrink-0">
          {data.sender?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.sender.imageUrl}
              alt={data.sender.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
              {data.sender?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
      )}

      <div
        className={`max-w-[70%] flex flex-col ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        {!isSender && data.sender?.name && (
          <span className="text-xs text-gray-500 mb-1 ml-1">
            {data.sender.name}
          </span>
        )}

        {/* Outer wrapper tracks the hover state */}
        <div className="relative group">
          {data.isDeleted ? (
            <div
              className={`px-4 py-2.5 rounded-2xl ${
                isSender ? "rounded-br-sm" : "rounded-bl-sm"
              } bg-gray-100`}
            >
              <p className="text-sm text-gray-400 italic">
                This message was deleted
              </p>
            </div>
          ) : (
            <div
              className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                isSender
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-900 rounded-bl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {data.content}
              </p>
            </div>
          )}

          {/* Reaction picker - FIXED HOVER GAP */}
          {!data.isDeleted && (
            <div
              className={`absolute -top-12 hidden group-hover:flex pb-4 z-20 ${
                isSender ? "right-0" : "left-0"
              }`}
            >
              <div className="flex items-center gap-1 bg-white rounded-xl shadow-lg border border-gray-100 px-2 py-1.5">
                {reactionOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)} // FIXED: handleReaction to handleReact
                    className="text-xl p-1 rounded-lg hover:bg-gray-50 hover:scale-125 hover:-translate-y-1 transition-all duration-200"
                    title={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delete button - shows on hover for own messages */}
          {!data.isDeleted && isSender && ( // FIXED: !message.isDeleted & isOwn to data/isSender
            <button
              onClick={handleDelete}
              className="absolute -bottom-2 -left-3 hidden group-hover:flex items-center justify-center w-7 h-7 bg-white border border-gray-100 rounded-full shadow-md text-gray-400 hover:text-red-600 hover:bg-red-50 hover:shadow-lg hover:scale-110 transition-all duration-200 z-30"
              title="Delete message"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {activeReactions.length > 0 && (
          <div
            className={`flex flex-wrap gap-1 mt-1 ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            {activeReactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => handleReact(r.emoji)}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition ${
                  viewerId && r.userIds.includes(viewerId)
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{r.emoji}</span>
                <span className="font-medium">{r.userIds.length}</span>
              </button>
            ))}
          </div>
        )}

        <span className="text-[10px] text-gray-400 mt-1">
          {formatMessageTime(data._creationTime)}
        </span>
      </div>
    </div>
  );
}