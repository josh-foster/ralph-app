/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { describe, expect, it } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.ts')

describe('columns.create', () => {
  it('places the new column after existing columns', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    // Board starts with 3 default columns at positions 1, 2, 3
    await t.mutation(api.columns.create, {
      boardId,
      title: 'Custom Column',
    })

    const columns = await t.query(api.columns.list, { boardId })
    expect(columns).toHaveLength(4)
    expect(columns[3].title).toBe('Custom Column')
    expect(columns[3].position).toBe(4)
  })

  it('places the first column at position 1 on an empty board', async () => {
    const t = convexTest(schema, modules)

    // Create a board, then delete its default columns to simulate empty
    const boardId = await t.mutation(api.boards.create, {
      title: 'Empty Board',
      userId: 'user_123',
    })

    const defaultColumns = await t.query(api.columns.list, { boardId })
    for (const col of defaultColumns) {
      await t.run(async (ctx) => {
        await ctx.db.delete(col._id)
      })
    }

    await t.mutation(api.columns.create, {
      boardId,
      title: 'First Column',
    })

    const columns = await t.query(api.columns.list, { boardId })
    expect(columns).toHaveLength(1)
    expect(columns[0].title).toBe('First Column')
    expect(columns[0].position).toBe(1)
  })
})
