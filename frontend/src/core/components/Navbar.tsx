import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/authStore"
import { getInitials } from "@utils/formatters"

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${
      isActive ? "text-brand-base font-semibold" : "text-gray-500 font-medium hover:text-gray-800"
    }`

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 min-h-[60px] py-3 sm:py-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between w-full sm:contents">
          <Link to="/dashboard" className="flex items-center">
            <picture>
              <source media="(max-width: 640px)" srcSet="/fav_icon.svg" />
              <img src="/Logo.svg" alt="Financy" className="h-7" />
            </picture>
          </Link>

          <button
            type="button"
            aria-label={user?.name ? `Abrir perfil de ${user.name}` : "Abrir perfil"}
            onClick={() => navigate("/perfil")}
            className="cursor-pointer w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 hover:ring-2 hover:ring-brand-base/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base transition-all sm:order-3"
          >
            <span aria-hidden="true">{user ? getInitials(user.name) : "?"}</span>
          </button>
        </div>

        <nav className="flex w-full sm:w-auto items-center justify-between sm:justify-center gap-4 sm:gap-6 sm:order-2">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/transacoes" className={navLinkClass}>
            Transações
          </NavLink>
          <NavLink to="/categorias" className={navLinkClass}>
            Categorias
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
