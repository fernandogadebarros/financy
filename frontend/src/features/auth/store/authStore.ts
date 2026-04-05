import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser } from "../types/auth.types"

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  updateUser: (user: AuthUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        localStorage.setItem("financy_token", token)
        set({ token, user, isAuthenticated: true })
      },

      updateUser: (user) => set({ user }),

      clearAuth: () => {
        localStorage.removeItem("financy_token")
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: "financy-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
