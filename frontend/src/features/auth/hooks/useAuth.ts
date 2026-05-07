import { useMutation } from "@tanstack/react-query"
import { graphqlClient } from "@/core/api/graphqlClient"
import { throwGraphQLMessage } from "@utils/auth"
import { LOGIN_MUTATION, REGISTER_MUTATION, UPDATE_ME_MUTATION } from "../graphql/auth.queries"
import { useAuthStore } from "../store/authStore"
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
  LoginResponse,
  RegisterResponse,
} from "../types/auth.types"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      try {
        const data = await graphqlClient.request<LoginResponse>(LOGIN_MUTATION, { input })
        return data.login
      } catch (e) {
        throwGraphQLMessage(e, "E-mail ou senha inválidos")
      }
    },
    onSuccess: (payload) => {
      setAuth(payload.token, payload.user)
    },
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      try {
        const data = await graphqlClient.request<RegisterResponse>(REGISTER_MUTATION, { input })
        return data.register
      } catch (e) {
        throwGraphQLMessage(e, "Erro ao criar conta")
      }
    },
    onSuccess: (payload) => {
      setAuth(payload.token, payload.user)
    },
  })
}

export function useUpdateMe() {
  const updateUser = useAuthStore((s) => s.updateUser)

  return useMutation({
    mutationFn: async (name: string) => {
      const data = await graphqlClient.request<{ updateMe: AuthUser }>(
        UPDATE_ME_MUTATION,
        { name }
      )
      return data.updateMe
    },
    onSuccess: (user) => {
      updateUser(user)
    },
  })
}
