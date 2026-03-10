import { v } from "convex/values";
import { mutation,query} from "./_generated/server";

// fiorst we check if the conversation already exist between the two user if yes we will return the conversation id if
//  not we will create a new conversation and return its id,to the [conversation] hehehe
export const getOrCreateDM = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, { otherUserId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const me = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
    if (!me) throw new Error("User not found");
    const [a, b] = [me._id, otherUserId].sort();
const dmKey = `${a}_${b}`;
    
    // Find existing DM,
    //but here we are getting all the conversations and them filtering them
    // and this is a  problem in scalling,will add the indexing here 

    // const allConvos = await ctx.db.query("conversations").collect();
    

    // const existing = allConvos.find(
    //   (c) =>
    //     !c.isGroup &&
    //     c.participants.length === 2 &&
    //     c.participants.includes(me._id) &&
    //     c.participants.includes(otherUserId)
    // );
    const existing = await ctx.db
  .query("conversations")
  .withIndex("by_dm_key", (q) => q.eq("dmKey", dmKey))
  .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participants: [me._id, otherUserId],
      isGroup: false,
      dmKey,
      lastMessageTime: Date.now(),
    });
  },
});


// based on the conversatio ID ,get theee conversation,
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const conversation = await ctx.db.get(conversationId);//--> direct lookup by primary key, as Primary key lookup → O(1)
    // no need to filter through all conversations
    if (!conversation) return null;

    const participants = await Promise.all(
      conversation.participants.map((id) => ctx.db.get(id))
    );

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return {
      ...conversation,
      participants: participants.filter(Boolean),
      me,
    };
  },
});


//not using this one currently
export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    //for verification
    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me) return [];

    const allConvos = await ctx.db
      .query("conversations")
      .order("desc")
      .collect();

    const myConvos = allConvos.filter((c) => c.participants.includes(me._id));

    // Enrich with participant info and unread count
    const enriched = await Promise.all(
      myConvos.map(async (convo) => {
        const participants = await Promise.all(
          convo.participants.map((id) => ctx.db.get(id))
        );

        // Get unread count 
    const readReceipt = await ctx.db
  .query("readReceipts")
  .withIndex("by_conversation_user", (q) =>
    q.eq("conversationId", convo._id).eq("userId", me._id)
  )
  .unique();

const lastReadTime = readReceipt?.lastReadTime ?? 0;

const unreadMessage = await ctx.db
  .query("messages")
  .withIndex("by_conversation", (q) =>
    q.eq("conversationId", convo._id)
     .gt("_creationTime", lastReadTime)
  )
  .filter((q) => q.neq(q.field("senderId"), me._id))
  .first();
const hasUnread = !!unreadMessage;
        // Count messages after lastReadTime not from me
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", convo._id)
          )
          .collect();

        const unreadCount = messages.filter(
          (m) =>
            m._creationTime > lastReadTime &&
            m.senderId !== me._id &&
            !m.isDeleted
        ).length;

        return {
          ...convo,
          participants: participants.filter(Boolean),
          unreadCount,
          hasUnread,
          me,
        };
      })
    );

    return enriched;
  },
});

export const createGroup = mutation({
  args: {
    memberIds: v.array(v.id("users")),
    groupName: v.string(),
  },
  handler: async (ctx, { memberIds, groupName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!me) throw new Error("User not found");

    const allParticipants = Array.from(new Set([me._id, ...memberIds]));

    return await ctx.db.insert("conversations", {
      participants: allParticipants,
      isGroup: true,
      groupName,
      lastMessageTime: Date.now(),
    });
  },
});


//this will be called when the userr opem  the caht

export const markAsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (!me) throw new Error("User not found");

    const existing = await ctx.db
      .query("readReceipts")
      .withIndex("by_conversation_user", (q) =>
        q.eq("conversationId", conversationId)
         .eq("userId", me._id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastReadTime: Date.now(),
      });
    } else {
      await ctx.db.insert("readReceipts", {
        conversationId,
        userId: me._id,
        lastReadTime: Date.now(),
      });
    }
  },
});