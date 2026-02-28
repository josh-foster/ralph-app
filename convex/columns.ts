import { query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: { boardId: v.id('boards') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('columns')
      .withIndex('boardId', (q) => q.eq('boardId', args.boardId))
      .collect()
  },
})
