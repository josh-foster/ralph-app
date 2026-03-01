import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'

import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { KanbanBoard } from '@/components/ui/kanban'

export const Route = createFileRoute('/boards/$boardId')({
  ssr: false,
  component: BoardViewPage,
})

function BoardViewPage() {
  const { boardId } = Route.useParams()
  const typedBoardId = boardId as Id<'boards'>
  const board = useQuery(api.boards.get, { id: typedBoardId })
  const columns = useQuery(api.columns.list, { boardId: typedBoardId })
  const cards = useQuery(api.cards.list, { boardId: typedBoardId })
  const createColumn = useMutation(api.columns.create)
  const createCard = useMutation(api.cards.create)
  const updateCard = useMutation(api.cards.update)
  const deleteCard = useMutation(api.cards.remove)
  const moveColumn = useMutation(api.columns.move).withOptimisticUpdate(
    (localStore, args) => {
      const currentColumns = localStore.getQuery(api.columns.list, {
        boardId: typedBoardId,
      })
      if (currentColumns === undefined) return

      const columnToMove = currentColumns.find((c) => c._id === args.id)
      if (!columnToMove) return

      const withoutColumn = currentColumns
        .filter((c) => c._id !== args.id)
        .sort((a, b) => a.position - b.position)

      withoutColumn.splice(args.position - 1, 0, { ...columnToMove })

      localStore.setQuery(
        api.columns.list,
        { boardId: typedBoardId },
        withoutColumn.map((c, i) => ({ ...c, position: i + 1 })),
      )
    },
  )
  const moveCard = useMutation(api.cards.move).withOptimisticUpdate(
    (localStore, args) => {
      const currentCards = localStore.getQuery(api.cards.list, {
        boardId: typedBoardId,
      })
      if (currentCards === undefined) return

      const cardToMove = currentCards.find((c) => c._id === args.id)
      if (!cardToMove) return

      const isSameColumn = cardToMove.columnId === args.targetColumnId

      if (isSameColumn) {
        const columnCards = currentCards
          .filter((c) => c.columnId === cardToMove.columnId)
          .sort((a, b) => a.position - b.position)
        const otherCards = currentCards.filter(
          (c) => c.columnId !== cardToMove.columnId,
        )
        const withoutCard = columnCards.filter((c) => c._id !== args.id)
        withoutCard.splice(args.position - 1, 0, { ...cardToMove })

        localStore.setQuery(
          api.cards.list,
          { boardId: typedBoardId },
          [
            ...otherCards,
            ...withoutCard.map((c, i) => ({ ...c, position: i + 1 })),
          ].sort((a, b) => a.position - b.position),
        )
      } else {
        const sourceCards = currentCards
          .filter(
            (c) => c.columnId === cardToMove.columnId && c._id !== args.id,
          )
          .sort((a, b) => a.position - b.position)
          .map((c, i) => ({ ...c, position: i + 1 }))

        const targetCards = currentCards
          .filter((c) => c.columnId === args.targetColumnId)
          .sort((a, b) => a.position - b.position)

        const movedCard = { ...cardToMove, columnId: args.targetColumnId }
        targetCards.splice(args.position - 1, 0, movedCard)
        const reindexedTarget = targetCards.map((c, i) => ({
          ...c,
          position: i + 1,
        }))

        const otherCards = currentCards.filter(
          (c) =>
            c.columnId !== cardToMove.columnId &&
            c.columnId !== args.targetColumnId,
        )

        localStore.setQuery(
          api.cards.list,
          { boardId: typedBoardId },
          [...otherCards, ...sourceCards, ...reindexedTarget].sort(
            (a, b) => a.position - b.position,
          ),
        )
      }
    },
  )

  if (!board) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground">Loading board...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/boards">Boards</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{board.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-xl font-semibold">{board.title}</h1>

      <KanbanBoard
        columns={columns ?? []}
        cards={cards ?? []}
        onAddColumn={(title) => createColumn({ boardId: typedBoardId, title })}
        onAddCard={(columnId, title, description) =>
          createCard({
            columnId: columnId as Id<'columns'>,
            title,
            description,
          })
        }
        onUpdateCard={(id, title, description) =>
          updateCard({ id: id as Id<'cards'>, title, description })
        }
        onDeleteCard={(id) => deleteCard({ id: id as Id<'cards'> })}
        onMoveCard={(id, targetColumnId, position) =>
          moveCard({
            id: id as Id<'cards'>,
            targetColumnId: targetColumnId as Id<'columns'>,
            position,
          })
        }
        onMoveColumn={(id, position) =>
          moveColumn({ id: id as Id<'columns'>, position })
        }
      />
    </div>
  )
}
