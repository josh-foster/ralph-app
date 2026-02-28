import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface KanbanColumnData {
  _id: string
  title: string
  position: number
}

interface KanbanColumnProps {
  column: KanbanColumnData
  className?: string
}

export function KanbanColumn({ column, className }: KanbanColumnProps) {
  return (
    <Card className={cn('w-72 shrink-0', className)}>
      <CardHeader className="border-b">
        <CardTitle>{column.title}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-32">
        <p className="text-muted-foreground text-xs">No cards yet</p>
      </CardContent>
    </Card>
  )
}
