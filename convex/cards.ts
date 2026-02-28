import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: { boardId: v.id('boards') },
  handler: async (ctx, args) => {
    const columns = await ctx.db
      .query('columns')
      .withIndex('boardId', (q) => q.eq('boardId', args.boardId))
      .collect()

    const columnIds = columns.map((c) => c._id)

    const allCards = []
    for (const columnId of columnIds) {
      const cards = await ctx.db
        .query('cards')
        .withIndex('columnId', (q) => q.eq('columnId', columnId))
        .collect()
      allCards.push(...cards)
    }

    return allCards.sort((a, b) => a.position - b.position)
  },
})

export const create = mutation({
  args: { columnId: v.id('columns'), title: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('cards')
      .withIndex('columnId', (q) => q.eq('columnId', args.columnId))
      .collect()

    const maxPosition = existing.reduce(
      (max, card) => Math.max(max, card.position),
      0,
    )

    return await ctx.db.insert('cards', {
      title: args.title,
      columnId: args.columnId,
      position: maxPosition + 1,
    })
  },
})
