import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
export default defineSchema({
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  boards: defineTable({
    title: v.string(),
    userId: v.string(),
  }).index('userId', ['userId']),
  columns: defineTable({
    title: v.string(),
    boardId: v.id('boards'),
    position: v.number(),
  }).index('boardId', ['boardId']),
  cards: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    columnId: v.id('columns'),
    position: v.number(),
  }).index('columnId', ['columnId']),
})
