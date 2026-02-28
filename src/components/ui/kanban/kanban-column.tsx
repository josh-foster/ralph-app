import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { IconPlus } from '@tabler/icons-react'
import { KanbanCard, type KanbanCardData } from './kanban-card'

export interface KanbanColumnData {
  _id: string
  title: string
  position: number
}

interface KanbanColumnProps {
  column: KanbanColumnData
  cards: KanbanCardData[]
  onAddCard?: (columnId: string, title: string, description?: string) => void
  onCardClick?: (card: KanbanCardData) => void
  className?: string
}

export function KanbanColumn({
  column,
  cards,
  onAddCard,
  onCardClick,
  className,
}: KanbanColumnProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAddCard?.(column._id, trimmed, description.trim() || undefined)
    setTitle('')
    setDescription('')
    setOpen(false)
  }

  return (
    <Card className={cn('w-72 shrink-0', className)}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{column.title}</CardTitle>
          {onAddCard && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <IconPlus className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Add Card</DialogTitle>
                    <DialogDescription>
                      Enter details for the new card.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-card-title">Title</Label>
                      <Input
                        id="new-card-title"
                        placeholder="Card title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-card-description">
                        Description (optional)
                      </Label>
                      <Textarea
                        id="new-card-description"
                        placeholder="Add a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
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
      </CardHeader>
      <CardContent className="min-h-32 space-y-2 p-3">
        {cards.length === 0 ? (
          <p className="text-muted-foreground text-xs">No cards yet</p>
        ) : (
          cards.map((card) => (
            <KanbanCard key={card._id} card={card} onClick={onCardClick} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
