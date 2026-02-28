import { useCallback, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { useAuth } from '@workos-inc/authkit-react'

import { api } from '../../../convex/_generated/api'
import { BoardList } from '@/components/board-list'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/boards/')({
  ssr: false,
  component: BoardsPage,
})

function BoardsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const boards = useQuery(
    api.boards.list,
    user?.id ? { userId: user.id } : 'skip',
  )

  const createBoard = useMutation(api.boards.create)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleCreate = useCallback(async () => {
    if (!newTitle.trim() || !user?.id) return
    const boardId = await createBoard({
      title: newTitle.trim(),
      userId: user.id,
    })
    setNewTitle('')
    setDialogOpen(false)
    navigate({ to: '/boards/$boardId', params: { boardId } })
  }, [createBoard, newTitle, user?.id, navigate])

  return (
    <div className="mx-auto max-w-4xl">
      <BoardList boards={boards} onCreateClick={() => setDialogOpen(true)} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Board</DialogTitle>
            <DialogDescription>
              Give your new board a name to get started.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
            }}
            placeholder="Board title"
            autoFocus
          />
          <DialogFooter>
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
