//here when the users loggs in via clerk,we will have to store it in the convex so the convecx client will have to be able to access the user data from the clerk 
// store it in the convex database so that we can use it later in the app wiht htea client provider 
//went throuhg the Convex docc for this and learned the 
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
 users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    lastSeen: v.number(),
    isOnline: v.boolean(),//will be true when the user logged in,will implemetn laterrr
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),
});
