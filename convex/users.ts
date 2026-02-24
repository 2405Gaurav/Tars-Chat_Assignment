import { mutation } from "./_generated/server";
import { v } from "convex/values";


//mutations in convexx-->> theasee are the TS function for the DB operation like insert,update,delete etccc
 
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", args.clerkId)
      )
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", args);
  },
});