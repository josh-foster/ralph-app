import { ConvexProvider } from 'convex/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { env } from '../../env.js'
import { requireEnv } from '../../lib/env'

const CONVEX_URL = requireEnv(
  env.VITE_CONVEX_URL,
  'Add your Convex URL to VITE_CONVEX_URL in .env.local',
)
const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      {children}
    </ConvexProvider>
  )
}
