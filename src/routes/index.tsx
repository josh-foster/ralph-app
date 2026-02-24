import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <section className="relative  text-center overflow-hidden">
        <h1>Hello World</h1>
      </section>
    </div>
  )
}
