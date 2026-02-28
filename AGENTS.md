# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Single-package TanStack Start (React SSR) app with Cloudflare Workers deployment target. Uses pnpm, Vite, Tailwind CSS v4, shadcn/ui, Convex (real-time backend), WorkOS AuthKit (auth), and Sentry (error monitoring).

### Environment variables

A `.env.local` file is required with at minimum these three variables (the app crashes without them due to `requireEnv()` calls in the Convex and WorkOS providers):

```
VITE_CONVEX_URL=https://placeholder-convex.convex.cloud
VITE_WORKOS_CLIENT_ID=client_placeholder
VITE_WORKOS_API_HOSTNAME=api.workos.com
```

Placeholder values allow the app to boot; Convex/WorkOS features won't function without real credentials. Sentry is optional and degrades gracefully.

### Commands

See `README.md` for standard commands. Key scripts from `package.json`:

- **Dev server:** `pnpm dev` (port 3000, loads `.env.local` via `dotenv-cli`)
- **Tests:** `pnpm test` (Vitest)
- **Lint:** `pnpm lint` (ESLint with `@tanstack/eslint-config`; note: pre-existing lint errors exist in the codebase)
- **Typecheck:** `pnpm typecheck` (tsc --noEmit)
- **Format:** `pnpm format` (Prettier)

### Gotchas

- The first SSR request after cold start may produce a transient React hooks error (`Cannot read properties of null (reading 'useContext')`) while Vite optimizes SSR dependencies. Subsequent requests work fine.
- `eslint` must be listed as a direct devDependency (it's only a peer dep of `@tanstack/eslint-config` and pnpm won't hoist it). If `pnpm lint` fails with `eslint: not found`, run `pnpm add -D eslint@9`.
- The Cloudflare Vite plugin (`@cloudflare/vite-plugin`) uses workerd for SSR in dev mode. The workerd binary downloads on first use via its JS shim, so the first `pnpm dev` start may take slightly longer.
- Pre-commit hooks (`.husky/pre-commit`) run lint-staged, typecheck, and tests.
