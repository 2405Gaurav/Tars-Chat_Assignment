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
    <ChatBox conversationId={conversationId as Id<"users_conversations">} />
  );
}
