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
 

 

  const handleReact = async (emoji: string) => {
    await reactToMessage({ messageId: data._id, emoji });
  };
  const reactToMessage = useMutation(api.messages.toggleReaction);

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

        <div className="relative group">
          {data.isDeleted ? (
            <div className="px-4 py-2 rounded-2xl bg-gray-200">
              <p className="text-sm text-gray-500 italic">
                This message was deleted
              </p>
            </div>
          ) : (
            <div
              className={`px-4 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap shadow-sm ${
                isSender
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-white text-gray-900 rounded-bl-sm border"
              }`}
            >
              {data.content}
            </div>
          )}

          {!data.isDeleted && (
            <div
              className={`absolute -top-11 hidden group-hover:flex items-center gap-1 bg-white border rounded-lg shadow-md px-2 py-1 z-20 ${
                isSender ? "right-0" : "left-0"
              }`}
            >
              {reactionOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
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