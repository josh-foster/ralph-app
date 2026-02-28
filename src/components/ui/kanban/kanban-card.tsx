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
  className?: string
}

export function KanbanCard({ card, className }: KanbanCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors hover:bg-accent',
        className,
      )}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
      </CardHeader>
    </Card>
  )
}
