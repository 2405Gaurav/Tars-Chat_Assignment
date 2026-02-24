import { mutation,query, } from "./_generated/server";
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


//to get the connect witht other user ,we will nedd to list all the user ,

// List all users except the current one
export const listAllUsers = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, { search }) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("listUsers - identity:", identity?.subject);
    if (!identity) return [];

    const allUsers = await ctx.db.query("users").collect();
    console.log("listUsers - all users count:", allUsers.length);
    console.log("listUsers - all users:", allUsers);
    const others = allUsers.filter((u) => u.clerkId !== identity.subject);
    console.log("listUsers - others count:", others.length);

    if (search && search.trim()) {
      const lower = search.toLowerCase();
      return others.filter((u) => u.name.toLowerCase().includes(lower));
    }

    return others;
  },
});


export const setPresence = mutation({
  args: { isOnline: v.boolean() },
  handler: async (ctx, { isOnline }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (user) {
      await ctx.db.patch(user._id, {
        isOnline,
        lastSeen: Date.now(),
      });
    }
  },
});



///for the individual chat we will have to check if the conversation already exist between the two user if yes we will return the conversation id if
//  not we will create a new conversation and return its id,to the [conversation] hehehe
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
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