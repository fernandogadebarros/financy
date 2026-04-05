import { GraphQLClient } from "graphql-request"

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/graphql"
const BACKEND_URL = rawBackendUrl.endsWith("/graphql")
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
