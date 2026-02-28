import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const DEFAULT_COLUMNS = ['To Do', 'In Progress', 'Done']

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('boards')
      .withIndex('userId', (q) => q.eq('userId', args.userId))
      .collect()
  },
})

export const get = query({
  args: { id: v.id('boards') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const create = mutation({
  args: { title: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const boardId = await ctx.db.insert('boards', {
      title: args.title,
      userId: args.userId,
    })

    for (let i = 0; i < DEFAULT_COLUMNS.length; i++) {
      await ctx.db.insert('columns', {
        title: DEFAULT_COLUMNS[i],
        boardId,
        position: i + 1,
      })
    }

    return boardId
  },
})
