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
    
    
    //now createing the DB for the convestion between user ,for this we will have to create doff fot individual and 
    //and then btw the groupsss
    conversations: defineTable({
        participants: v.array(v.id("users")),
        isGroup: v.boolean(),//later when we will implement the group chat we will set this to true and for the individual chat it will be false
        groupName: v.optional(v.string()),
        lastMessageTime: v.optional(v.number()),
        lastMessagePreview: v.optional(v.string()),
    }).index("by_last_message", ["lastMessageTime"]),

///messsage schenmaaa
    messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isDeleted: v.boolean(),
    reactions: v.optional(
      v.array(
        v.object({
          emoji: v.string(),
          userIds: v.array(v.id("users")),
        })
      )
    ),
  }).index("by_conversation", ["conversationId"]),

    
});