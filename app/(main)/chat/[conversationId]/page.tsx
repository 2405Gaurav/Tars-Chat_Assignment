//lets crate a message/chat box for this conversation ,in here we will same the individuals and also groupsss
//we will send the conversation id ,and depending on it the chat/msg box will render
"use client";

import { use } from "react";
import ChatBox from "@/components/ChatBox";
import { Id } from "@/convex/_generated/dataModel";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);

  return (
    <div className="h-screen flex">
      <div className="flex-1 min-h-0 flex flex-col">
        <ChatBox conversationId={conversationId as Id<"conversations">} />
      </div>
    </div>
  );
}
