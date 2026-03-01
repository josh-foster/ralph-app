import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn, type KanbanColumnData } from './kanban-column'
import { KanbanCard, type KanbanCardData } from './kanban-card'
import { KanbanCardDetailModal } from './kanban-card-detail-modal'
import { KanbanCardMoveModal } from './kanban-card-move-modal'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IconPlus } from '@tabler/icons-react'

interface KanbanBoardProps {
  columns: KanbanColumnData[]
  cards: KanbanCardData[]
  onAddColumn?: (title: string) => void
  onAddCard?: (columnId: string, title: string, description?: string) => void
  onUpdateCard?: (id: string, title: string, description?: string) => void
  onDeleteCard?: (id: string) => void
  onMoveCard?: (id: string, targetColumnId: string, position: number) => void
  className?: string
}

export function KanbanBoard({
  columns,
  cards,
  onAddColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard,
  className,
}: KanbanBoardProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState<KanbanCardData | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [activeCard, setActiveCard] = useState<KanbanCardData | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleCardClick(card: KanbanCardData) {
    setSelectedCard(card)
    setDetailOpen(true)
  }

  function handleMoveClick() {
    setDetailOpen(false)
    setMoveOpen(true)
  }

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c._id === event.active.id)
    if (card) setActiveCard(card)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null)

    const { active, over } = event
    if (!over || active.id === over.id) return

    const draggedCard = cards.find((c) => c._id === active.id)
    if (!draggedCard) return

    const overData = over.data.current
    if (overData?.type === 'card') {
      const overCard = overData.card as KanbanCardData
      const targetColumnCards = cards
        .filter((c) => c.columnId === overCard.columnId)
        .sort((a, b) => a.position - b.position)
      const overIndex = targetColumnCards.findIndex(
        (c) => c._id === overCard._id,
      )
      onMoveCard?.(draggedCard._id, overCard.columnId, overIndex + 1)
    } else if (overData?.type === 'column') {
      const targetColumnId = over.id as string
      const targetColumnCards = cards.filter(
        (c) => c.columnId === targetColumnId && c._id !== draggedCard._id,
      )
      onMoveCard?.(
        draggedCard._id,
        targetColumnId,
        targetColumnCards.length + 1,
      )
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAddColumn?.(trimmed)
    setTitle('')
    setOpen(false)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn('flex gap-4 overflow-x-auto p-2', className)}>
        {columns.map((column) => (
          <KanbanColumn
            key={column._id}
            column={column}
            cards={cards.filter((c) => c.columnId === column._id)}
            onAddCard={onAddCard}
            onCardClick={handleCardClick}
          />
        ))}

        <KanbanCardDetailModal
          key={selectedCard?._id}
          card={selectedCard}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onUpdate={onUpdateCard}
          onDelete={onDeleteCard}
          onMoveClick={onMoveCard ? handleMoveClick : undefined}
        />

        <KanbanCardMoveModal
          key={moveOpen ? selectedCard?._id : undefined}
          card={selectedCard}
          columns={columns}
          cards={cards}
          open={moveOpen}
          onOpenChange={setMoveOpen}
          onMove={onMoveCard}
        />

        {onAddColumn && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto w-72 shrink-0 py-8">
                <IconPlus className="mr-2 size-4" />
                Add Column
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Column</DialogTitle>
                  <DialogDescription>
                    Enter a title for the new column.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Column title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!title.trim()}>
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="w-64">
            <KanbanCard card={activeCard} className="rotate-3 shadow-xl" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
