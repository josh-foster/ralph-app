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
  const moveCard = useMutation(api.cards.move)

  if (!board) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground">Loading board...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
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
      />
    </div>
  )
}
