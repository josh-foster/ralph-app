import { IconPlus, IconColumns3 } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface Board {
  _id: string
  title: string
}

interface BoardListProps {
  boards: Board[] | undefined
  onCreateClick: () => void
}

export function BoardList({ boards, onCreateClick }: BoardListProps) {
  if (!boards)
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground">Loading boards...</p>
      </div>
    )
  if (boards.length === 0)
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <IconColumns3 className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">No boards yet</p>
        <p className="text-muted-foreground text-sm">
          Create your first board to get started
        </p>
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <Link
            key={board._id}
            to="/boards/$boardId"
            params={{ boardId: board._id }}
            className="block"
          >
            <Card className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <CardTitle>{board.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
