import { mutation } from "./_generated/server";
import { v } from "convex/values";


//mutations in convexx-->> theasee are the TS function for the DB operation like insert,update,delete etccc

//instead of creating user we will first chek if the use alredy exist in DB and if yes 
//update its info if NOT only then create a new user in the DB
// Upsert user on login 
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("upsertUser called with:", args);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    console.log("upsertUser - existing user:", existing);

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        isOnline: true,
        lastSeen: Date.now(),
      });
      console.log("upsertUser - updated existing user:", existing._id);
      return existing._id;
    } else {
      const newId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        isOnline: true,
        lastSeen: Date.now(),
      });
      console.log("upsertUser - created new user:", newId);
      return newId;
    }
  },
});




















// export const createUser = mutation({
//   args: {
//     clerkId: v.string(),
//     name: v.string(),
//     email: v.string(),
//     image: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const existing = await ctx.db
//       .query("users")
//       .withIndex("by_clerk_id", (q) =>
//         q.eq("clerkId", args.clerkId)
//       )
//       .unique();

//     if (existing) return existing._id;

//     return await ctx.db.insert("users", args);
//   },
// });