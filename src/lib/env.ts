export function requireEnv(
  value: string | undefined,
  errorMessage: string,
): string {
  if (!value) {
    throw new Error(errorMessage)
  }

  return value
}
