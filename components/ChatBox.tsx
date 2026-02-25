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
  
  // Refs
  const prevMessageCountRef = useRef(0);
  const initialLoadRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Convex Hooks
  const conversation = useQuery(api.users_conversations.getConversation, { conversationId });
  const messages = useQuery(api.messages.listMessages, { conversationId });
  const typingUsers = useQuery(api.messages.getTypingUsers, { conversationId });

  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.messages.setTyping);
  const markAsRead = useMutation(api.messages.markAsRead);

  const currentUser = conversation?.me;

  // --- Logic: Scroll & Message Handling ---
  const scrollToBottom = useCallback((smooth = true) => {
    if (!scrollContainerRef.current || !messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ 
      behavior: smooth ? "smooth" : "auto" 
    });
    setShowNewMessages(false);
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 150;
    setIsAtBottom(atBottom);
    if (atBottom) setShowNewMessages(false);
  };

  useEffect(() => {
    if (messages) {
      markAsRead({ conversationId }).catch(() => {});
      const count = messages.length;
      const prevCount = prevMessageCountRef.current;

      if (initialLoadRef.current && count > 0) {
        setTimeout(() => scrollToBottom(false), 50);
        initialLoadRef.current = false;
      } else if (count > prevCount) {
        if (isAtBottom) {
          setTimeout(() => scrollToBottom(true), 100);
        } else {
          setTimeout(() => setShowNewMessages(true), 0);
        }
      }
      prevMessageCountRef.current = count;
    }
  }, [messages, conversationId, markAsRead, isAtBottom, scrollToBottom]);

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
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
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

  // --- Logic: Header Info ---
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
    const other = (conversation.participants as any[]).find((p) => p?.clerkId !== user?.id);
    return {
      name: other?.name ?? "Unknown",
      subtitle: other?.isOnline ? "Online" : "Offline",
      avatar: other,
      isOnline: other?.isOnline ?? false,
    };
  };

  const { name, subtitle, avatar, isOnline } = getHeaderInfo();

  return (
    // Base: Dark Background
    <div className="relative flex flex-col h-full bg-[#0f1014] text-gray-100 font-sans overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/30 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-900/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
      </div>

      {/* --- Header --- */}
      <div className="flex items-center gap-4 px-6 h-16 bg-white/3 backdrop-blur-xl border-b border-white/5 z-20 shrink-0 shadow-lg">
        {/* Mobile Back Button */}
        <button
          onClick={() => router.push("/chat")}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-transform hover:-translate-x-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="relative shrink-0 cursor-pointer group">
          <div className="p-0.5 rounded-full border border-purple-500/30 group-hover:border-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            {avatar?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={avatar.imageUrl} 
                    alt={name} 
                    className="w-8 h-8 rounded-full object-cover" 
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-900/40 to-indigo-900/40 text-gray-200 flex items-center justify-center font-bold text-xs">
                   {name.charAt(0).toUpperCase()}
                </div>
            )}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0f1014] shadow-[0_0_8px_#10b981]"></div>
          )}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
             <h3 className="font-bold text-gray-100 text-sm truncate tracking-tight group-hover:text-purple-300 transition-colors">
               {name}
             </h3>
             {conversation?.isGroup && (
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-widest">
                  BOT
                </span>
             )}
          </div>
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">
            {subtitle}
          </span>
        </div>
      </div>

      {/* --- Messages Area --- */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scroll-smooth z-10 relative custom-scrollbar"
      >
        {messages === undefined ? (
          // Skeleton
          <div className="space-y-8 mt-6 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse opacity-30">
                <div className="w-9 h-9 bg-gray-600 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full pt-1">
                   <div className="h-3 bg-gray-600 rounded w-24"></div>
                   <div className="h-12 bg-gray-700/50 rounded-lg w-2/3 border border-white/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full pb-10 text-center opacity-80 hover:opacity-100 transition-opacity duration-500">
             <div className="w-20 h-20 bg-linear-to-tr from-purple-900/20 to-indigo-900/20 rounded-full flex items-center justify-center border border-white/5 shadow-[0_0_30px_rgba(88,28,135,0.2)] mb-4 animate-in zoom-in-50 duration-500">
                <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
             </div>
             <p className="text-xs font-bold text-gray-400 tracking-wide uppercase">
                Start Chatting with {name}
             </p>
          </div>
        ) : (
          <>
            {/* Messages */}
            {messages.filter(Boolean).map((msg, idx) => {
              const prevMsg = messages[idx - 1];
              const showDateDivider =
                !prevMsg ||
                new Date(msg._creationTime).toDateString() !== new Date(prevMsg._creationTime).toDateString();
              
              const messageData = { ...msg, sender: msg.sender ?? undefined };

              return (
                <div key={msg._id} className="group">
                  {showDateDivider && (
                    <div className="relative flex items-center justify-center my-13">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                      </div>
                      <span className="relative bg-[#0f1014] px-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                        {formatDateDivider(msg._creationTime)}
                      </span>
                    </div>
                  )}
                  
                  <MessageItem
                    data={messageData}
                    isSender={msg.senderId === currentUser?._id}
                    reactionOptions={REACTIONS}
                    viewerId={currentUser?._id}
                  />
                </div>
              );
            })}
            
            {/* Typing */}
            {typingUsers && typingUsers.length > 0 && (
              <div className="pl-4 py-1 animate-pulse opacity-70">
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 <TypingIndicator users={typingUsers as any[]} />
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-px" />
          </>
        )}
      </div>

      {/* --- New Messages Badge --- */}
      {showNewMessages && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
           <button
             onClick={() => scrollToBottom(true)}
             className="flex items-center gap-2 bg-purple-600/90 text-white px-3 py-1 rounded-full shadow-xl backdrop-blur-md transition-all animate-bounce text-[10px] font-bold uppercase tracking-widest border border-purple-400/30"
           >
             New Messages ↓
           </button>
        </div>
      )}

      {/* --- Input Area (Compact) --- */}
      <div className="px-3 pb-1 pt-1 mb-0 shrink-0 z-20">
        <div className="relative bg-[#1a1b23]/90 backdrop-blur-2xl border border-white/5 rounded-xl flex items-end px-2 py-1.5 shadow-2xl transition-all ring-1 ring-black/20 focus-within:border-purple-500/30 focus-within:bg-[#1a1b23]">
          
     

          {/* Text Input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 focus:outline-none resize-none max-h-[20vh] custom-scrollbar leading-relaxed py-1.5 font-medium text-sm"
            style={{ minHeight: '24px' }}
          />
          
          {/* Right Action Icons */}
          <div className="flex items-center gap-1 ml-1 mb-0.5">
             {/* Sticker Icon */}
             <button className="text-gray-500 hover:text-purple-300 transition-colors hidden sm:block p-1.5 hover:bg-white/5 rounded-lg">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </button>
             {/* Send Button */}
             <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`
                  p-1.5 transition-all shrink-0 rounded-lg
                  ${input.trim() 
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg transform hover:scale-105' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'}
                `}
             >
                <svg className="w-5 h-5 translate-x-px translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
             </button>
          </div>
          
           {/* Error Overlay */}
            {sendError && (
                <div className="absolute -top-8 right-0 bg-red-500/90 text-white text-[10px] px-2 py-1 rounded shadow-lg font-bold">
                    {sendError}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

// Utility fot he dateee
function formatDateDivider(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "TODAY";
  if (date.toDateString() === yesterday.toDateString()) return "YESTERDAY";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}