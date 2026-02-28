/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { describe, expect, it } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.ts')

describe('boards.create', () => {
  it('creates a board with three default columns in correct order', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'My Board',
      userId: 'user_123',
    })

    const board = await t.query(api.boards.get, { id: boardId })
    expect(board).toMatchObject({ title: 'My Board', userId: 'user_123' })

    const columns = await t.query(api.columns.list, { boardId })
    expect(columns).toHaveLength(3)
    expect(columns.map((c) => c.title)).toEqual([
      'To Do',
      'In Progress',
      'Done',
    ])
    expect(columns.map((c) => c.position)).toEqual([1, 2, 3])
  })
})

describe('boards.get', () => {
  it('returns a single board by ID', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    const board = await t.query(api.boards.get, { id: boardId })
    expect(board).not.toBeNull()
    expect(board).toMatchObject({ title: 'Test Board', userId: 'user_123' })
    expect(board!._id).toBe(boardId)
  })
})

describe('columns.list', () => {
  it('returns columns in position order', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Ordered Board',
      userId: 'user_123',
    })

    const columns = await t.query(api.columns.list, { boardId })
    expect(columns).toHaveLength(3)

    for (let i = 1; i < columns.length; i++) {
      expect(columns[i].position).toBeGreaterThan(columns[i - 1].position)
    }

    expect(columns.map((c) => c.title)).toEqual([
      'To Do',
      'In Progress',
      'Done',
    ])
  })
})

describe('boards.list', () => {
  it('returns only boards belonging to the given user', async () => {
    const t = convexTest(schema, modules)

    await t.mutation(api.boards.create, {
      title: 'Alice Board',
      userId: 'user_alice',
    })
    await t.mutation(api.boards.create, {
      title: 'Bob Board',
      userId: 'user_bob',
    })
    await t.mutation(api.boards.create, {
      title: 'Alice Board 2',
      userId: 'user_alice',
    })

    const aliceBoards = await t.query(api.boards.list, {
      userId: 'user_alice',
    })
    expect(aliceBoards).toHaveLength(2)
    expect(aliceBoards.map((b) => b.title)).toEqual([
      'Alice Board',
      'Alice Board 2',
    ])

    const bobBoards = await t.query(api.boards.list, { userId: 'user_bob' })
    expect(bobBoards).toHaveLength(1)
    expect(bobBoards[0].title).toBe('Bob Board')
  })

  it('returns empty array when user has no boards', async () => {
    const t = convexTest(schema, modules)

    const boards = await t.query(api.boards.list, { userId: 'user_nobody' })
    expect(boards).toEqual([])
  })
})
