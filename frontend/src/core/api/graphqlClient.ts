import { GraphQLClient, ClientError } from "graphql-request"

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "/graphql"
const BACKEND_URL = rawBackendUrl.startsWith("/")
  ? `${window.location.origin}${rawBackendUrl}`
  : rawBackendUrl.endsWith("/graphql")
    ? rawBackendUrl
    : `${rawBackendUrl.replace(/\/+$/, "")}/graphql`

const TOKEN_KEY = "financy_token"
const AUTH_STORAGE_KEY = "financy-auth"

function isUnauthorized(error: ClientError): boolean {
  if (error.response?.status === 401) return true
  return (
    error.response?.errors?.some((e) => {
      const code = (e.extensions?.code as string | undefined)?.toUpperCase()
      return code === "UNAUTHENTICATED" || code === "UNAUTHORIZED"
    }) ?? false
  )
}

function redirectToLogin() {
  if (typeof window === "undefined") return
  if (window.location.pathname === "/login") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
  window.location.assign("/login")
}

export const graphqlClient = new GraphQLClient(BACKEND_URL, {
  requestMiddleware: (request) => {
    const token = localStorage.getItem(TOKEN_KEY)
    return {
      ...request,
      headers: {
        ...request.headers,
        "Content-Type": "application/json",
        "apollo-require-preflight": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  },
  responseMiddleware: (response) => {
    if (response instanceof ClientError && isUnauthorized(response)) {
      redirectToLogin()
    }
  },
})
