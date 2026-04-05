import { GraphQLClient } from "graphql-request"

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "/graphql"
const BACKEND_URL = rawBackendUrl.startsWith("/")
  ? `${window.location.origin}${rawBackendUrl}`
  : rawBackendUrl.endsWith("/graphql")
    ? rawBackendUrl
    : `${rawBackendUrl.replace(/\/+$/, "")}/graphql`

export const graphqlClient = new GraphQLClient(BACKEND_URL, {
  requestMiddleware: (request) => {
    const token = localStorage.getItem("financy_token")
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
})
