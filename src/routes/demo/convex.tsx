import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { IconCircleDashed, IconPlus, IconTrash } from '@tabler/icons-react'

import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/demo/convex')({
  ssr: false,
  component: ConvexTodos,
})

function ConvexTodos() {
  const todos = useQuery(api.todos.list)
  const addTodo = useMutation(api.todos.add)
  const toggleTodo = useMutation(api.todos.toggle)
  const removeTodo = useMutation(api.todos.remove)

  const [newTodo, setNewTodo] = useState('')

  const handleAddTodo = useCallback(async () => {
    if (newTodo.trim()) {
      await addTodo({ text: newTodo.trim() })
      setNewTodo('')
    }
  }, [addTodo, newTodo])

  const handleToggleTodo = useCallback(
    async (id: Id<'todos'>) => {
      await toggleTodo({ id })
    },
    [toggleTodo],
  )

  const handleRemoveTodo = useCallback(
    async (id: Id<'todos'>) => {
      await removeTodo({ id })
    },
    [removeTodo],
  )

  const completedCount = todos?.filter((todo) => todo.completed).length || 0
  const totalCount = todos?.length || 0

  return (
    <div className="bg-background flex h-full items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Convex Todos</CardTitle>
            <CardDescription>Powered by real-time sync</CardDescription>
          </CardHeader>
          {totalCount > 0 && (
            <CardFooter className="gap-2">
              <Badge variant="secondary">{completedCount} completed</Badge>
              <Badge variant="outline">
                {totalCount - completedCount} remaining
              </Badge>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTodo()
                }}
                placeholder="What needs to be done?"
              />
              <Button
                size="lg"
                onClick={handleAddTodo}
                disabled={!newTodo.trim()}
              >
                <IconPlus data-icon="inline-start" className="pb-0.5" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {!todos ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
                <p className="text-muted-foreground">Loading todos...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <IconCircleDashed className="text-muted-foreground size-8" />
                <p className="text-sm font-medium">No todos yet</p>
                <p className="text-muted-foreground">
                  Add your first todo above to get started
                </p>
              </div>
            ) : (
              <div>
                {todos.map((todo, index) => (
                  <div key={todo._id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center gap-3 py-2">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleTodo(todo._id)}
                      />
                      <span
                        className={cn(
                          'flex-1 text-sm',
                          todo.completed &&
                            'text-muted-foreground line-through',
                        )}
                      >
                        {todo.text}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveTodo(todo._id)}
                      >
                        <IconTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {totalCount > 0 && (
            <CardFooter>
              <p className="text-muted-foreground">
                Built with Convex &mdash; Real-time updates &mdash; Always in
                sync
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
