"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";

const REACTIONS = ["😂", "🫡", "❤️", "💀", "😮", "😢", "😍"];

interface Props {
  conversationId: Id<"conversations">;
}

export default function ChatWindow({ conversationId }: Props) {
  const { user } = useUser();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessages, setShowNewMessages] = useState(false);
  
  // Use a Ref to track previous message count to avoid triggering re-renders in useEffect
  const prevMessageCountRef = useRef(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const conversation = useQuery(api.users_conversations.getConversation, { conversationId });
  const messages = useQuery(api.messages.listMessages, { conversationId });
  const typingUsers = useQuery(api.messages.getTypingUsers, { conversationId });

  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.messages.setTyping);
  const markAsRead = useMutation(api.messages.markAsRead);

  const currentUser = conversation?.me;

  // Optimized Scroll Logic
  const scrollToBottom = useCallback((force = false) => {
    if (!scrollContainerRef.current) return;
    
    // We can't scroll if elements aren't rendered yet
    if (!messagesEndRef.current) return;

    if (force) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" }); // Instant for load
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // If user is already near bottom (within 100px), scroll to new message
    if (distanceFromBottom < 150) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowNewMessages(false);
    }
  }, []);

  // Handle New Messages & Read Status
  useEffect(() => {
    if (messages) {
      // 1. Mark as read
      markAsRead({ conversationId }).catch(() => {});

      // 2. Handle Scrolling
      const count = messages.length;
      const prevCount = prevMessageCountRef.current;

      if (count > prevCount) {
        // New message arrived
        if (isAtBottom) {
          setTimeout(() => scrollToBottom(false), 10);
        } else {
          setShowNewMessages(true);
        }
      }
      
      // Update ref
      prevMessageCountRef.current = count;
    }
  }, [messages, conversationId, markAsRead, isAtBottom, scrollToBottom]);

  // Initial Scroll on Load
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Small timeout ensures DOM is ready
      setTimeout(() => scrollToBottom(true), 50);
    }
  }, [conversationId, messages?.length, scrollToBottom]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsAtBottom(atBottom);
    if (atBottom) setShowNewMessages(false);
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content) return;

    setInput("");
    setSendError(null);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      await sendMessage({ conversationId, content });
      setTimeout(() => scrollToBottom(true), 10);
    } catch {
      setSendError("Failed to send.");
      setInput(content);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 128) + 'px';
    }

    setTyping({ conversationId }).catch(() => {});
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {}, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getHeaderInfo = () => {
    if (!conversation) return { name: "Loading...", subtitle: "", avatar: null, isOnline: false };

    if (conversation.isGroup) {
      return {
        name: conversation.groupName ?? "Group",
        subtitle: `${conversation.participants.length} members`,
        avatar: null,
        isOnline: false,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const other = (conversation.participants as any[]).find(
      (p) => p?.clerkId !== user?.id
    );
    return {
      name: other?.name ?? "Unknown",
      subtitle: other?.isOnline ? "Online" : "Offline",
      avatar: other,
      isOnline: other?.isOnline ?? false,
    };
  };

  const { name, subtitle, avatar, isOnline } = getHeaderInfo();

  return (
    <div className="flex flex-col h-full bg-slate-700">
      {/* Header - Discord Dark Theme */}
      <div 
        className="flex items-center gap-3 px-4 py-3 bg-slate-900 shadow-md z-10 border-b border-slate-950" 
      >
        <button
          onClick={() => router.push("/chat")}
          className="md:hidden p-2 hover:bg-slate-800 rounded-md text-gray-400"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative shrink-0">
          {avatar?.imageUrl ? (
            <img src={avatar.imageUrl} alt={name} className="w-9 h-9 rounded-full object-cover bg-slate-800" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-gray-300 font-bold">
               <span className="text-lg">#</span>
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
             <h3 className="font-bold text-gray-100 text-sm tracking-wide truncate">{name}</h3>
             {conversation?.isGroup && (
                <span className="bg-slate-800 text-slate-400 text-[10px] px-1 rounded shrink-0">BOT</span>
             )}
          </div>
          <p className="text-xs text-slate-400 font-medium truncate">
            {subtitle}
          </p>
        </div>
        
        {/* Header Icons */}
        <div className="hidden md:flex gap-4 text-slate-400">
             <svg className="w-6 h-6 hover:text-gray-200 cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 relative custom-scrollbar"
      >
        {messages === undefined ? (
          // Dark Mode Skeleton
          <div className="space-y-6 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-9 h-9 bg-slate-800 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full">
                   <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                   <div className="h-10 bg-slate-800 rounded-md w-3/4 opacity-60"></div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          // Discord Empty State
          <div className="flex flex-col items-start justify-end h-full pb-8 px-4">
            <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center mb-4">
               <span className="text-3xl text-slate-600">#</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to #{name}!</h2>
            <p className="text-slate-400 text-sm mb-1">
              This is the start of your conversation with {name}.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const prevMsg = messages[idx - 1];
              const showDateDivider =
                !prevMsg ||
                new Date(msg._creationTime).toDateString() !==
                  new Date(prevMsg._creationTime).toDateString();

              return (
                <div key={msg._id}>
                  {showDateDivider && (
                    <div className="flex items-center gap-3 my-6">
                      <div className="flex-1 h-px bg-slate-600"></div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                        {formatDateDivider(msg._creationTime)}
                      </span>
                      <div className="flex-1 h-px bg-slate-600"></div>
                    </div>
                  )}
                  {/* @ts-expect-error - Ignoring type mismatch for quick fix as per request */}
                  <MessageItem
                    message={msg} 
                    isOwn={msg.senderId === currentUser?._id}
                    allowedReactions={REACTIONS}
                    currentUserId={currentUser?._id}
                  />
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {typingUsers && typingUsers.length > 0 && (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <TypingIndicator users={typingUsers as any[]} />
            )}
            
            <div ref={messagesEndRef} className="h-px" />
          </>
        )}
      </div>

      {/* New Messages Toast */}
      {showNewMessages && (
        <div className="absolute bottom-24 right-4 z-20">
          <button
            onClick={() => scrollToBottom(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg text-xs font-bold uppercase tracking-wide hover:bg-indigo-500 transition-colors animate-bounce"
          >
            New Messages
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-4 bg-slate-700">
        <div className="bg-slate-800 rounded-lg flex items-center px-4 py-2.5 shadow-sm border-t border-slate-700/50">
          
          <button className="text-slate-400 hover:text-gray-200 transition-colors mr-3 shrink-0 bg-slate-700 rounded-full w-6 h-6 flex items-center justify-center">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
             </svg>
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${name}`}
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-slate-500 focus:outline-none resize-none max-h-48 custom-scrollbar"
            style={{ minHeight: '24px' }}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`
              ml-3 p-1.5 rounded hover:bg-slate-700 transition-all shrink-0
              ${input.trim() ? 'text-indigo-400' : 'text-slate-600 cursor-not-allowed'}
            `}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        
        {sendError && (
            <div className="mt-1 text-xs text-red-400 text-right">
                {sendError}
            </div>
        )}
      </div>
    </div>
  );
}

function formatDateDivider(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}