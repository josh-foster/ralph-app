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
  args: {
    columnId: v.id('columns'),
    title: v.string(),
    description: v.optional(v.string()),
  },
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
      description: args.description,
      columnId: args.columnId,
      position: maxPosition + 1,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('cards'),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
    })
  },
})

export const remove = mutation({
  args: { id: v.id('cards') },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.id)
    if (!card) return

    await ctx.db.delete(args.id)

    const remaining = await ctx.db
      .query('cards')
      .withIndex('columnId', (q) => q.eq('columnId', card.columnId))
      .collect()

    const sorted = remaining.sort((a, b) => a.position - b.position)
    for (let i = 0; i < sorted.length; i++) {
      await ctx.db.patch(sorted[i]._id, { position: i + 1 })
    }
  },
})
