import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// Sending the message  based in the ID,be it Individual and group 
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, { conversationId, content }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me) throw new Error("User not found");

    const msgId = await ctx.db.insert("messages", {
      conversationId,
      senderId: me._id,
      content,
      isDeleted: false,
      reactions: [],
    });

    // Update conversation last message
    await ctx.db.patch(conversationId, {
      lastMessageTime: Date.now(),
      lastMessagePreview: content.slice(0, 100),
    });

   

    return msgId;
  },
});

// List messages in a conversation
export const listMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("asc")
      .collect();

    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return { ...msg, sender };
      })
    );

    return enriched;
  },
});



export const setTyping = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me) return;

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", conversationId).eq("userId", me._id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastTyped: Date.now() });
    } else {
      await ctx.db.insert("typingIndicators", {
        conversationId,
        userId: me._id,
        lastTyped: Date.now(),
      });
    }
  },
});

// Get typing indicators for a conversation
export const getTypingUsers = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const twoSecondsAgo = Date.now() - 2000;
    const indicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();

    const activeTypers = indicators.filter(
      (i) => i.lastTyped > twoSecondsAgo && i.userId !== me?._id
    );

    const users = await Promise.all(
      activeTypers.map((i) => ctx.db.get(i.userId))
    );

    return users.filter(Boolean);
  },
});


export const markAsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me) return;

    const existing = await ctx.db
      .query("readReceipts")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", conversationId).eq("userId", me._id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastReadTime: Date.now() });
    } else {
      await ctx.db.insert("readReceipts", {
        conversationId,
        userId: me._id,
        lastReadTime: Date.now(),
      });
    }
  },
});