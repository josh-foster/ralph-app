import { AuthKitProvider } from '@workos-inc/authkit-react'
import { useNavigate } from '@tanstack/react-router'
import { env } from '../../env.js'
import { requireEnv } from '../../lib/env'

const VITE_WORKOS_CLIENT_ID = requireEnv(
  env.VITE_WORKOS_CLIENT_ID,
  'Add your WorkOS Client ID to the .env.local file',
)

const VITE_WORKOS_API_HOSTNAME = requireEnv(
  env.VITE_WORKOS_API_HOSTNAME,
  'Add your WorkOS API Hostname to the .env.local file',
)

export default function AppWorkOSProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate()

  return (
    <AuthKitProvider
      clientId={VITE_WORKOS_CLIENT_ID}
      apiHostname={VITE_WORKOS_API_HOSTNAME}
      onRedirectCallback={({ state }) => {
        if (state?.returnTo) {
          navigate(state.returnTo)
        }
      }}
    >
      {children}
    </AuthKitProvider>
  )
}
