import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface KanbanCardData {
  _id: string
  title: string
  description?: string
  columnId: string
  position: number
}

interface KanbanCardProps {
  card: KanbanCardData
  onClick?: (card: KanbanCardData) => void
  className?: string
}

export function KanbanCard({ card, onClick, className }: KanbanCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors hover:bg-accent',
        className,
      )}
      onClick={() => onClick?.(card)}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
      </CardHeader>
    </Card>
  )
}
