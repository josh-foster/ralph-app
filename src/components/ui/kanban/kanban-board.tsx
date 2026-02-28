import { useState } from 'react'
import { KanbanColumn, type KanbanColumnData } from './kanban-column'
import type { KanbanCardData } from './kanban-card'
import { KanbanCardDetailModal } from './kanban-card-detail-modal'
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
  className?: string
}

export function KanbanBoard({
  columns,
  cards,
  onAddColumn,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  className,
}: KanbanBoardProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState<KanbanCardData | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  function handleCardClick(card: KanbanCardData) {
    setSelectedCard(card)
    setDetailOpen(true)
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
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
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
  )
}
