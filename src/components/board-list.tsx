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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Boards</h1>
        <Button onClick={onCreateClick}>
          <IconPlus data-icon="inline-start" className="pb-0.5" />
          Create Board
        </Button>
      </div>

      {!boards ? (
        <div className="flex flex-col items-center gap-2 py-12">
          <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading boards...</p>
        </div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12">
          <IconColumns3 className="text-muted-foreground size-8" />
          <p className="text-sm font-medium">No boards yet</p>
          <p className="text-muted-foreground text-sm">
            Create your first board to get started
          </p>
        </div>
      ) : (
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
      )}
    </div>
  )
}
