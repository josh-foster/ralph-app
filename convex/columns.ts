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

export const move = mutation({
  args: {
    id: v.id('columns'),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const column = await ctx.db.get(args.id)
    if (!column) return

    const siblings = await ctx.db
      .query('columns')
      .withIndex('boardId', (q) => q.eq('boardId', column.boardId))
      .collect()

    const withoutColumn = siblings
      .filter((c) => c._id !== args.id)
      .sort((a, b) => a.position - b.position)

    withoutColumn.splice(args.position - 1, 0, column)

    for (let i = 0; i < withoutColumn.length; i++) {
      await ctx.db.patch(withoutColumn[i]._id, { position: i + 1 })
    }
  },
})
