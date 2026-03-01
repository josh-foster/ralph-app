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

describe('columns.move', () => {
  it('moves a column to a new position and recalculates all positions', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    // Default columns: To Do (1), In Progress (2), Done (3)
    const before = await t.query(api.columns.list, { boardId })
    expect(before.map((c) => c.title)).toEqual(['To Do', 'In Progress', 'Done'])

    // Move "Done" (position 3) to position 1
    await t.mutation(api.columns.move, {
      id: before[2]._id,
      position: 1,
    })

    const after = await t.query(api.columns.list, { boardId })
    expect(after.map((c) => c.title)).toEqual(['Done', 'To Do', 'In Progress'])
    expect(after.map((c) => c.position)).toEqual([1, 2, 3])
  })

  it('moves a column forward and preserves contiguous positions', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    const before = await t.query(api.columns.list, { boardId })

    // Move "To Do" (position 1) to position 3
    await t.mutation(api.columns.move, {
      id: before[0]._id,
      position: 3,
    })

    const after = await t.query(api.columns.list, { boardId })
    expect(after.map((c) => c.title)).toEqual(['In Progress', 'Done', 'To Do'])
    expect(after.map((c) => c.position)).toEqual([1, 2, 3])
  })

  it('column order persists after multiple reorders', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    await t.mutation(api.columns.create, { boardId, title: 'Review' })

    // Now: To Do (1), In Progress (2), Done (3), Review (4)
    const cols = await t.query(api.columns.list, { boardId })
    expect(cols.map((c) => c.title)).toEqual([
      'To Do',
      'In Progress',
      'Done',
      'Review',
    ])

    // Move "Review" to position 2
    await t.mutation(api.columns.move, {
      id: cols[3]._id,
      position: 2,
    })

    const afterFirst = await t.query(api.columns.list, { boardId })
    expect(afterFirst.map((c) => c.title)).toEqual([
      'To Do',
      'Review',
      'In Progress',
      'Done',
    ])

    // Move "To Do" to position 4
    await t.mutation(api.columns.move, {
      id: afterFirst[0]._id,
      position: 4,
    })

    const afterSecond = await t.query(api.columns.list, { boardId })
    expect(afterSecond.map((c) => c.title)).toEqual([
      'Review',
      'In Progress',
      'Done',
      'To Do',
    ])
    expect(afterSecond.map((c) => c.position)).toEqual([1, 2, 3, 4])
  })
})
