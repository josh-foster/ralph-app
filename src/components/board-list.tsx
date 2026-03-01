import { IconPlus, IconColumns3, IconTrash } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Board {
  _id: string
  title: string
}

interface BoardListProps {
  boards: Board[] | undefined
  onCreateClick: () => void
  onDeleteBoard: (boardId: string) => void
}

export function BoardList({
  boards,
  onCreateClick,
  onDeleteBoard,
}: BoardListProps) {
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
            <div key={board._id} className="relative">
              <Link
                to="/boards/$boardId"
                params={{ boardId: board._id }}
                className="block"
              >
                <Card className="transition-colors hover:border-foreground/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{board.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive absolute top-3 right-3 size-8"
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete board?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the board and all its columns
                      and cards. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => onDeleteBoard(board._id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
