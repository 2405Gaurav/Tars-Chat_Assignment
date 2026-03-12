//lets crate a message/chat box for this conversation ,in here we will same the individuals and also groupsss
//we will send the conversation id ,and depending on it the chat/msg box will render
"use client";


// useSyncUser exists to synchronize the authenticated user from Clerk into your application database managed by Convex.
import { use } from "react";
import ChatBox from "@/components/ChatBox";
import { Id } from "@/convex/_generated/dataModel";
// This hook is not for detecting changes.
// It is mainly a client-side safety sync to ensure the user exists in your Convex DB when the user enters the app.
export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);

  // No h-screen wrapper here — the layout already handles full height.
  // Just fill the parent flex container provided by ChatLayout > SidebarInset > main.
  return (
    <div className="flex-1 h-full min-h-0 flex flex-col overflow-hidden">
      <ChatBox conversationId={conversationId as Id<"conversations">} />
    </div>
  );
}
