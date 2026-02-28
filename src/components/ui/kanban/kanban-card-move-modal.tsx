import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { KanbanCardData } from './kanban-card'
import type { KanbanColumnData } from './kanban-column'

interface KanbanCardMoveModalProps {
  card: KanbanCardData | null
  columns: KanbanColumnData[]
  cards: KanbanCardData[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onMove?: (id: string, targetColumnId: string, position: number) => void
}

export function KanbanCardMoveModal({
  card,
  columns,
  cards,
  open,
  onOpenChange,
  onMove,
}: KanbanCardMoveModalProps) {
  const [targetColumnId, setTargetColumnId] = useState(card?.columnId ?? '')
  const [targetPosition, setTargetPosition] = useState('1')

  const positionOptions = useMemo(() => {
    if (!card) return []
    const columnCards = cards.filter((c) => c.columnId === targetColumnId)
    const isSameColumn = targetColumnId === card.columnId
    const count = isSameColumn ? columnCards.length : columnCards.length + 1
    return Array.from({ length: count }, (_, i) => i + 1)
  }, [card, cards, targetColumnId])

  function handleColumnChange(columnId: string) {
    setTargetColumnId(columnId)
    setTargetPosition('1')
  }

  function handleConfirm() {
    if (!card) return
    onMove?.(card._id, targetColumnId, parseInt(targetPosition, 10))
    onOpenChange(false)
  }

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Card</DialogTitle>
          <DialogDescription>
            Choose a column and position for "{card.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Column</Label>
            <Select value={targetColumnId} onValueChange={handleColumnChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col._id} value={col._id}>
                    {col.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={targetPosition} onValueChange={setTargetPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positionOptions.map((pos) => (
                  <SelectItem key={pos} value={String(pos)}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Move</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
