"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  conversationId: Id<"conversations">;
}

export default function ChatWindow({ conversationId }: Props) {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useQuery(api.users_conversations.getConversation, {
    conversationId,
  });

  const messages = useQuery(api.messages.listMessages, {
    conversationId,
  });

  const sendMessage = useMutation(api.messages.sendMessage);

  const currentUser = conversation?.me;

  // Auto scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content) return;

    await sendMessage({ conversationId, content });
    setInput("");
  };

  if (!conversation || !messages) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }

  const otherUser = conversation.participants.find(
    (p: any) => p.clerkId !== user?.id
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b">
        <h2 className="font-semibold text-gray-900">
          {otherUser?.name ?? "Chat"}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                  isOwn
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={`Message ${otherUser?.name ?? ""}`}
            className="flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-full disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}