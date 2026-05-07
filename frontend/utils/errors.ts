import { ClientError } from "graphql-request"

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid credentials": "E-mail ou senha inválidos",
}

export function getErrorMessage(error: unknown, fallback = "Erro inesperado"): string {
  if (error instanceof ClientError) {
    const raw = error.response?.errors?.[0]?.message ?? ""
    return ERROR_MESSAGES[raw] ?? raw ?? fallback
  }
  if (error instanceof Error) return error.message
  if (typeof error === "string") return error
  return fallback
}

export function throwGraphQLMessage(error: unknown, fallback: string): never {
  if (error instanceof ClientError) {
    const raw = error.response?.errors?.[0]?.message ?? ""
    throw new Error(ERROR_MESSAGES[raw] ?? fallback)
  }
  throw error
}
