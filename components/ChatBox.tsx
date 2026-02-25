"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";
import { Send, Smile, Paperclip, ChevronLeft, MoreVertical, Phone } from "lucide-react";
import  {formatTimestamp}  from "../libs/utils";

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
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
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
    // FIX: Main Container uses w-full and flex-col to fill space correctly next to sidebar
    <div className="flex flex-col h-full w-full bg-[#0f1014] text-gray-100 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
         {/* Grid Texture */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      </div>

      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 px-4 md:px-6 h-16 bg-white/[0.02] backdrop-blur-xl border-b border-white/5 z-20 shrink-0 shadow-sm relative">
        {/* Mobile Back Button */}
        <button
          onClick={() => router.push("/chat")}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-transform hover:-translate-x-1"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0 cursor-pointer group">
          <div className="p-0.5 rounded-full border border-purple-500/30 group-hover:border-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            {avatar?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={avatar.imageUrl} 
                    alt={name} 
                    className="w-9 h-9 rounded-full object-cover" 
                />
            ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                   {name.charAt(0).toUpperCase()}
                </div>
            )}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0f1014] shadow-[0_0_8px_#10b981]"></div>
          )}
        </div>

        {/* Name & Status */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
             <h3 className="font-bold text-gray-100 text-sm truncate tracking-tight group-hover:text-purple-300 transition-colors">
               {name}
             </h3>
             {conversation?.isGroup && (
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                  GROUP
                </span>
             )}
          </div>
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase truncate">
            {subtitle}
          </span>
        </div>

        {/* Header Actions (Optional) */}
        <div className="flex items-center gap-2 text-gray-400">
            <button className="p-2 hover:bg-white/5 rounded-full hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-6 scroll-smooth z-10 relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {messages === undefined ? (
          // Skeleton
          <div className="space-y-8 mt-6 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse opacity-30">
                <div className="w-9 h-9 bg-gray-600 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full pt-1">
                   <div className="h-3 bg-gray-600 rounded w-24"></div>
                   <div className="h-10 bg-gray-700/50 rounded-lg w-1/2 border border-white/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full pb-20 text-center opacity-0 animate-in fade-in zoom-in-95 duration-700 fill-mode-forwards">
             <div className="w-24 h-24 bg-[#1a1b23]/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/5 shadow-[0_0_50px_rgba(88,28,135,0.2)] mb-6 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👋</span>
                </div>
             </div>
             <p className="text-lg font-black text-gray-200 tracking-tight mb-2">
                Say Hello!
             </p>
             <p className="text-xs text-gray-500 font-medium max-w-[200px] leading-relaxed">
                This is the beginning of your legendary conversation with <span className="text-purple-400 font-bold">{name}</span>.
             </p>
          </div>
        ) : (
          <>
            {/* Message List */}
            {messages.filter(Boolean).map((msg, idx) => {
              const prevMsg = messages[idx - 1];
              const showDateDivider =
                !prevMsg ||
                new Date(msg._creationTime).toDateString() !== new Date(prevMsg._creationTime).toDateString();
              
              const messageData = { ...msg, sender: msg.sender ?? undefined };

              return (
                <div key={msg._id} className="group">
                  {showDateDivider && (
                    <div className="relative flex items-center justify-center my-16">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                      </div>
                      <span className="relative bg-[#0f1014] px-3 py-1 rounded-full border border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest shadow-sm z-10">
                        {formatTimestamp(msg._creationTime)}
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
            
            {/* Typing Indicator */}
            {typingUsers && typingUsers.length > 0 && (
              <div className="pl-4 py-2 animate-in fade-in slide-in-from-left-2 duration-300">
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 <TypingIndicator users={typingUsers as any[]} />
              </div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} className="h-px w-full" />
          </>
        )}
      </div>

      {/* --- FLOATING NOTIFICATION --- */}
      {showNewMessages && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
           <button
             onClick={() => scrollToBottom(true)}
             className="flex items-center gap-2 bg-[#1a1b23]/90 text-purple-300 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl border border-purple-500/30 hover:scale-105 transition-all text-[10px] font-black uppercase tracking-widest animate-bounce"
           >
             New Messages ↓
           </button>
        </div>
      )}

      {/* --- INPUT AREA --- */}
     
     {/* --- INPUT AREA --- */}
<div className="shrink-0 z-20 p-4 pt-1 bg-gradient-to-t from-[#0f1014] via-[#0f1014] to-transparent">
        <div className="relative bg-[#1a1b23]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex items-end px-3 py-2 shadow-2xl transition-all focus-within:border-purple-500/30 focus-within:ring-1 focus-within:ring-purple-500/20 focus-within:bg-[#1a1b23]">
          
          {/* Left Actions */}
          <button className="p-2 text-gray-500 hover:text-purple-400 hover:bg-white/5 rounded-xl transition-all mr-1 shrink-0">
             <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${conversation?.isGroup ? 'Group' : name.split(' ')[0]}...`}
            rows={1}
            className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 focus:outline-none resize-none max-h-[150px] custom-scrollbar leading-relaxed py-2 font-medium text-sm"
            style={{ minHeight: '24px' }}
          />
          
          {/* Right Action Icons */}
          <div className="flex items-center gap-1 ml-2 mb-0.5 shrink-0">
             <button className="text-gray-500 hover:text-yellow-400 transition-colors hidden sm:block p-2 hover:bg-white/5 rounded-xl">
               <Smile className="w-5 h-5" />
             </button>
             
             {/* Send Button */}
             <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`
                  p-2 transition-all shrink-0 rounded-xl flex items-center justify-center
                  ${input.trim() 
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] transform hover:-translate-y-0.5' 
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'}
                `}
                >
                <Send className="w-4 h-4 ml-0.5" />
             </button>
          </div>
          
           {/* Error Overlay */}
            {sendError && (
                <div className="absolute -top-10 right-0 bg-red-500/90 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl font-bold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
                    {sendError}
                </div>
            )}
        </div>
      </div>
    </div>
  );

}

