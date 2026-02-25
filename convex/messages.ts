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
  args: { 
    conversationId: v.id("conversations"),
    isTyping: v.boolean(), 
  },
  handler: async (ctx, { conversationId, isTyping }) => {
    const identity = await ctx.auth.getUserIdentity();//
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

    if (isTyping) {
      // Add or refresh
      if (existing) {
        await ctx.db.patch(existing._id, { lastTyped: Date.now() });
      } else {
        await ctx.db.insert("typingIndicators", {
          conversationId,
          userId: me._id,
          lastTyped: Date.now(),
        });
      }
    } else {
      // Immediately delete on stop/send
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    }
  },
});

// Get typing indicators for a conversation to shoe the typing of the other user in the chatbox
// Convex automatically re-runs getTypingUsers whenever:
// typingIndicators table changes
// Or conversationId data changes
export const getTypingUsers = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();//auth
    if (!identity) return [];

    const me = await ctx.db//we qury this to exclude the current user from the typing indicators
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const twoSecondsAgo = Date.now() - 2000;
    // If user stops typing → indicator auto expires after 2 seconds.
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

//chenge the reacton on the message like if the user has already react with the same emoji then remove it and if not then add it to the message
export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, { messageId, emoji }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me) throw new Error("User not found");

    const msg = await ctx.db.get(messageId);
    if (!msg) throw new Error("Message not found");

    const reactions = msg.reactions ?? [];
    const existing = reactions.find((r) => r.emoji === emoji);

    let newReactions;
    if (existing) {
      const hasReacted = existing.userIds.includes(me._id);
      if (hasReacted) {
        // Remove reaction
        const newUserIds = existing.userIds.filter((id) => id !== me._id);
        if (newUserIds.length === 0) {
          newReactions = reactions.filter((r) => r.emoji !== emoji);
        } else {
          newReactions = reactions.map((r) =>
            r.emoji === emoji ? { ...r, userIds: newUserIds } : r
          );
        }
      } else {
        newReactions = reactions.map((r) =>
          r.emoji === emoji
            ? { ...r, userIds: [...r.userIds, me._id] }
            : r
        );
      }
    } else {
      newReactions = [...reactions, { emoji, userIds: [me._id] }];
    }

    await ctx.db.patch(messageId, { reactions: newReactions });
  },
});




//at last deelte the message ,gtgtgt heheh 
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me) throw new Error("User not found");

    const msg = await ctx.db.get(messageId);
    if (!msg) throw new Error("Message not found");
    if (msg.senderId !== me._id) throw new Error("Not your message");

    await ctx.db.patch(messageId, { isDeleted: true });
  },
});