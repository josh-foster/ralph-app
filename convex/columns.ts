import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: { boardId: v.id('boards') },
  handler: async (ctx, args) => {
    const columns = await ctx.db
      .query('columns')
      .withIndex('boardId', (q) => q.eq('boardId', args.boardId))
      .collect()
    return columns.sort((a, b) => a.position - b.position)
  },
})

export const create = mutation({
  args: { boardId: v.id('boards'), title: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('columns')
      .withIndex('boardId', (q) => q.eq('boardId', args.boardId))
      .collect()

    const maxPosition = existing.reduce(
      (max, col) => Math.max(max, col.position),
      0,
    )

    return await ctx.db.insert('columns', {
      title: args.title,
      boardId: args.boardId,
      position: maxPosition + 1,
    })
  },
})
