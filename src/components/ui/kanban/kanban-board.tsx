import { KanbanColumn, type KanbanColumnData } from './kanban-column'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  columns: KanbanColumnData[]
  className?: string
}

export function KanbanBoard({ columns, className }: KanbanBoardProps) {
  if (columns.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        This board has no columns yet.
      </p>
    )
  }

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map((column) => (
        <KanbanColumn key={column._id} column={column} />
      ))}
    </div>
  )
}
