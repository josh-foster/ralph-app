/// <reference types="vite/client" />
import { convexTest } from 'convex-test'
import { describe, expect, it } from 'vitest'
import { api } from './_generated/api'
import schema from './schema'

const modules = import.meta.glob('./**/*.ts')

describe('cards.create', () => {
  it('places a card at the end of the column', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    const columns = await t.query(api.columns.list, { boardId })
    const columnId = columns[0]._id

    await t.mutation(api.cards.create, { columnId, title: 'First Card' })
    await t.mutation(api.cards.create, { columnId, title: 'Second Card' })

    const cards = await t.query(api.cards.list, { boardId })
    const columnCards = cards.filter((c) => c.columnId === columnId)
    expect(columnCards).toHaveLength(2)
    expect(columnCards[0].title).toBe('First Card')
    expect(columnCards[0].position).toBe(1)
    expect(columnCards[1].title).toBe('Second Card')
    expect(columnCards[1].position).toBe(2)
  })
})

describe('cards.list', () => {
  it('returns cards in position order across all columns', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    const columns = await t.query(api.columns.list, { boardId })
    const col1 = columns[0]._id
    const col2 = columns[1]._id

    await t.mutation(api.cards.create, { columnId: col1, title: 'Col1 Card A' })
    await t.mutation(api.cards.create, { columnId: col1, title: 'Col1 Card B' })
    await t.mutation(api.cards.create, { columnId: col2, title: 'Col2 Card A' })

    const cards = await t.query(api.cards.list, { boardId })
    expect(cards).toHaveLength(3)

    const col1Cards = cards.filter((c) => c.columnId === col1)
    const col2Cards = cards.filter((c) => c.columnId === col2)
    expect(col1Cards[0].title).toBe('Col1 Card A')
    expect(col1Cards[1].title).toBe('Col1 Card B')
    expect(col2Cards[0].title).toBe('Col2 Card A')
  })
})

describe('cards.update', () => {
  it('persists title and description changes', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    const columns = await t.query(api.columns.list, { boardId })
    const columnId = columns[0]._id

    const cardId = await t.mutation(api.cards.create, {
      columnId,
      title: 'Original Title',
    })

    await t.mutation(api.cards.update, {
      id: cardId,
      title: 'Updated Title',
      description: 'A description',
    })

    const cards = await t.query(api.cards.list, { boardId })
    const card = cards.find((c) => c._id === cardId)!
    expect(card.title).toBe('Updated Title')
    expect(card.description).toBe('A description')
  })
})

describe('cards.delete', () => {
  it('removes the card and remaining cards maintain position order', async () => {
    const t = convexTest(schema, modules)

    const boardId = await t.mutation(api.boards.create, {
      title: 'Test Board',
      userId: 'user_123',
    })

    const columns = await t.query(api.columns.list, { boardId })
    const columnId = columns[0]._id

    await t.mutation(api.cards.create, { columnId, title: 'Card A' })
    const cardBId = await t.mutation(api.cards.create, {
      columnId,
      title: 'Card B',
    })
    await t.mutation(api.cards.create, { columnId, title: 'Card C' })

    await t.mutation(api.cards.remove, { id: cardBId })

    const cards = await t.query(api.cards.list, { boardId })
    const columnCards = cards.filter((c) => c.columnId === columnId)
    expect(columnCards).toHaveLength(2)
    expect(columnCards[0].title).toBe('Card A')
    expect(columnCards[0].position).toBe(1)
    expect(columnCards[1].title).toBe('Card C')
    expect(columnCards[1].position).toBe(2)
  })
})
