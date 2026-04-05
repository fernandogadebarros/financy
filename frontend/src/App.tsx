import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/authStore"
import AppLayout from "@/core/components/AppLayout"
import LoginPage from "@/features/auth/pages/LoginPage"
import RegisterPage from "@/features/auth/pages/RegisterPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import TransactionsPage from "@/features/transactions/pages/TransactionsPage"
import CategoriesPage from "@/features/categories/pages/CategoriesPage"
import ProfilePage from "@/features/profile/pages/ProfilePage"

function RootRedirect() {
  const { isAuthenticated } = useAuthStore()
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona / conforme auth */}
        <Route path="/" element={<RootRedirect />} />

        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        {/* Rotas protegidas (layout com Navbar) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transacoes" element={<TransactionsPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
