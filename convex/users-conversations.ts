import { v } from "convex/values";
import { mutation} from "./_generated/server";

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

    // Find existing DM
    const allConvos = await ctx.db.query("conversations").collect();
    const existing = allConvos.find(
      (c) =>
        !c.isGroup &&
        c.participants.length === 2 &&
        c.participants.includes(me._id) &&
        c.participants.includes(otherUserId)
    );

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participants: [me._id, otherUserId],
      isGroup: false,
      lastMessageTime: Date.now(),
    });
  },
});